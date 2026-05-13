from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

cloudinary.config(
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
  api_key = os.getenv("CLOUDINARY_API_KEY"),
  api_secret = os.getenv("CLOUDINARY_API_SECRET")
)

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --- DATABASE MODELS ---
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    items = db.relationship('Item', backref='owner', lazy=True)

class Item(db.Model):
    __tablename__ = 'item'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    item_category = db.Column(db.String(50), nullable=False)
    contact = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    is_resolved = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "item_category": self.item_category,
            "contact": self.contact,
            "image_url": self.image_url,
            "is_resolved": self.is_resolved,
            "user_id": self.user_id,
            "owner_username": self.owner.username
        }

# --- AUTH ROUTES ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 400
    
    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(username=data['username'], password_hash=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token, user={"id": user.id, "username": user.username}), 200
    return jsonify({"message": "Invalid credentials"}), 401


@app.route('/api/items', methods=['GET'])
def get_items():
    items = Item.query.order_by(Item.id.desc()).all()
    return jsonify([item.to_dict() for item in items]), 200

@app.route('/api/items', methods=['POST'])
@jwt_required()
def add_item():
    current_user_id = get_jwt_identity()
    
    title = request.form.get('title')
    description = request.form.get('description')
    category = request.form.get('category')
    item_category = request.form.get('item_category')
    contact = request.form.get('contact')
    
    image_file_url = None
    if 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            upload_result = cloudinary.uploader.upload(file)
            image_file_url = upload_result.get('secure_url')

    new_item = Item(
        title=title, description=description, category=category,
        item_category=item_category, contact=contact, 
        image_url=image_file_url, user_id=current_user_id
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify({"message": "Item added successfully!", "image_url": image_file_url}), 201

@app.route('/api/items/<int:item_id>', methods=['DELETE', 'PUT'])
@jwt_required()
def modify_item(item_id):
    current_user_id = get_jwt_identity()
    item = Item.query.get_or_404(item_id)
    
    # 1. FIXED Security Check (String vs String)
    if str(item.user_id) != str(current_user_id):
        return jsonify({"message": "Unauthorized action"}), 403

    # --- DELETE REQUEST ---
    if request.method == 'DELETE':
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Item deleted"}), 200
        
    # --- PUT REQUEST (Handles both Edit and Mark Found) ---
    if request.method == 'PUT':
        # If the request contains form data, it's an EDIT request
        if request.form:
            item.title = request.form.get('title', item.title)
            item.description = request.form.get('description', item.description)
            item.category = request.form.get('category', item.category)
            item.item_category = request.form.get('item_category', item.item_category)
            item.contact = request.form.get('contact', item.contact)
            db.session.commit()
            return jsonify({"message": "Item updated successfully"}), 200
            
        # If there is no form data, it's a "MARK AS RESOLVED" request
        else:
            item.is_resolved = True
            db.session.commit()
            return jsonify({"message": "Item marked as resolved"}), 200

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)