from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import os

app = Flask(__name__)

# Configure Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///estate_management.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'supersecretkey')

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Import models
from models import Manager, Estate, House, Tenant, Staff, Request, Task, Payment, Receipt, CheckIn

# Route to create manager
@app.route('/manager', methods=['POST'])
def create_manager():
    data = request.get_json()
    new_manager = Manager(email=data['email'], phone=data['phone'])
    db.session.add(new_manager)
    db.session.commit()
    return jsonify({'message': 'Manager created successfully'})

# Login route with JWT and OTP verification (simple example)
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    phone = data.get('phone')  # Simulate OTP sent to phone
    # Here you would verify the OTP sent to the phone

    manager = Manager.query.filter_by(email=email).first()
    if not manager:
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity={'email': manager.email})
    return jsonify(access_token=access_token)

# Sample route to fetch tenants
@app.route('/tenants', methods=['GET'])
@jwt_required()
def get_tenants():
    tenants = Tenant.query.all()
    tenant_list = [{"id": tenant.id, "name": tenant.name, "email": tenant.email, "phone": tenant.phone} for tenant in tenants]
    return jsonify(tenant_list)

# Error handler
@app.errorhandler(404)
def not_found(e):
    return jsonify({'message': 'Resource not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)