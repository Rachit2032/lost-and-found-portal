from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import cloudinary
import cloudinary.uploader

cloudinary.config(
  cloud_name = "cloud_name",
  api_key = "api_key",
  api_secret = "api_secret"
)

app = Flask(__name__)
CORS(app)

# Format: postgresql://username:password@localhost/database_name
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://username:password@localhost/database_name'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- DATABASE MODEL ---
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False) # 'Lost' or 'Found'
    contact = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "contact": self.contact,
            "image_url": self.image_url
        }

@app.route('/api/items', methods=['POST'])
def add_item():
    
    title = request.form.get('title')
    description = request.form.get('description')
    category = request.form.get('category')
    contact = request.form.get('contact')
    
    # Image Handling
    image_file_url = None
    if 'image' in request.files:
        file = request.files['image']
        if file.filename != '':
            upload_result = cloudinary.uploader.upload(file)
            image_file_url = upload_result.get('secure_url')

    new_item = Item(
        title=title,
        description=description,
        category=category,
        contact=contact,
        image_url=image_file_url
    )
    
    db.session.add(new_item)
    db.session.commit()
    
    return jsonify({
        "message": "Item added successfully with image!", 
        "image_url": image_file_url
    }), 201

@app.route('/api/items', methods=['GET'])
def get_items():
    items = Item.query.all()
    return jsonify([item.to_dict() for item in items]), 200

if __name__ == '__main__':
    app.run(debug=True)