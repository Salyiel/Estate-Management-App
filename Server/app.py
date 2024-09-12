from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from flask_socketio import SocketIO, emit
from datetime import timedelta
from flask_cors import CORS
from twilio.rest import Client
import os
import random
 
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configure Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///estate_management.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'supersecretkey')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Email Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')  # Replace with your email
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')  # Replace with your email password
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'your_email@gmail.com')


# Twilio configuration (replace with your own credentials)
account_sid = os.environ.get('TWILIO_ACCOUNT_SID')  # Twilio account SID
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')    # Twilio auth token
twilio_phone = os.environ.get('TWILIO_PHONE')       # Your Twilio phone number

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mail = Mail(app)
socketio = SocketIO(app)
client = Client(account_sid, auth_token)

# Import models
from models import Manager, Estate, House, Tenant, Staff, Request, Task, Payment, Receipt, CheckIn, MaintenanceRequest, Message, CommentFeedback

# Route to create manager
@app.route('/manager', methods=['POST'])
def create_manager():
    data = request.get_json()
    if not data or 'email' not in data or 'phone' not in data:
        return jsonify({'message': 'Invalid data'}), 400
    new_manager = Manager(email=data['email'], phone=data['phone'])
    db.session.add(new_manager)
    db.session.commit()
    return jsonify({'message': 'Manager created successfully'}), 201

# Signup Route
@app.route('/signup', methods=['POST'])  # Changed from '/api/signup' to '/signup'
def signup():
    data = request.get_json()

    # Extracting data from the request
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    position = data.get('position')

    # User creation logic
    new_user = Manager(name=name, email=email, password=bcrypt.generate_password_hash(password).decode('utf-8'), position=position)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201


# OTP generation function
def generate_otp():
    return str(random.randint(100000, 999999))

# Route to generate and send OTP
@app.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    phone = data.get('phone')

    if not phone:
        return jsonify({'error': 'Phone number is required'}), 400

    otp = generate_otp()

    # Send OTP to phone number using Twilio
    try:
        message = client.messages.create(
            body=f'Your OTP is {otp}',
            from_=twilio_phone,
            to=phone
        )
        # Store the OTP in the database or cache (here we simulate it with an in-memory variable)
        manager = Manager.query.filter_by(phone=phone).first()
        if manager:
            manager.otp = otp  # Store OTP temporarily
            db.session.commit()

        return jsonify({'message': 'OTP sent successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to send OTP', 'details': str(e)}), 500


# Sign-in route to verify OTP
@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    otp = data.get('otp')  # OTP provided by the user

    # Validate email and password
    manager = Manager.query.filter_by(email=email).first()

    if not manager or not bcrypt.check_password_hash(manager.password, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Check OTP
    if manager.otp != otp:
        return jsonify({'message': 'Invalid OTP'}), 401

    # OTP is valid, create a JWT token
    access_token = create_access_token(identity={'email': manager.email})

    # Clear OTP after successful login
    manager.otp = None
    db.session.commit()

    return jsonify(access_token=access_token), 200

# Endpoint to get tenant information
@app.route('/tenants', methods=['GET'])
@jwt_required()
def get_tenants():
    tenants = Tenant.query.all()
    tenant_list = [{
        'id': tenant.id,
        'name': tenant.name,
        'email': tenant.email,
        'billingHistory': tenant.payments and sum(payment.amount for payment in tenant.payments) or 'N/A'
    } for tenant in tenants]

    return jsonify(tenant_list)

# Endpoint to get staff information
@app.route('/staff', methods=['GET'])
@jwt_required()
def get_staff():
    staff = Staff.query.all()
    staff_list = [{
        'id': staff_member.id,
        'name': staff_member.name,
        'shift': f"{staff_member.check_in_time.strftime('%I:%M %p') if staff_member.check_in_time else 'N/A'} - {staff_member.check_out_time.strftime('%I:%M %p') if staff_member.check_out_time else 'N/A'}",
        'hoursWorked': staff_member.check_out_time and (staff_member.check_out_time - staff_member.check_in_time).total_seconds() // 3600 or 'N/A'
    } for staff_member in staff]

    return jsonify(staff_list)

# Endpoint to get work schedule for a specific staff member
@app.route('/work-schedule', methods=['GET'])
@jwt_required()
def get_work_schedule():
    staff_id = get_jwt_identity()
    
    staff = Staff.query.filter_by(id=staff_id).first()
    if staff:
        schedule = {
            'date': staff.work_date.strftime('%Y-%m-%d'),
            'shift': f"{staff.shift_start.strftime('%I:%M %p')} - {staff.shift_end.strftime('%I:%M %p')}"
        }
        return jsonify(schedule), 200
    else:
        return jsonify({"error": "No work schedule found for this staff member"}), 404

# Endpoint to get maintenance requests
@app.route('/maintenance', methods=['GET'])
@jwt_required()
def get_maintenance_requests():
    requests = MaintenanceRequest.query.all()
    request_list = [{
        'id': request.id,
        'description': request.description,
        'status': request.status
    } for request in requests]

    return jsonify(request_list)

# Endpoint to handle payments
@app.route('/payments', methods=['POST'])
@jwt_required()
def create_payment():
    data = request.get_json()

    if not data or 'amount' not in data or 'date' not in data or 'paymentType' not in data:
        return jsonify({'error': 'Amount, date, and paymentType are required'}), 400

    new_payment = Payment(
        amount=data['amount'],
        date=data['date'],
        payment_type=data['paymentType']
    )
    db.session.add(new_payment)
    db.session.commit()

    return jsonify({
        'id': new_payment.id,
        'amount': new_payment.amount,
        'date': new_payment.date,
        'paymentType': new_payment.payment_type
    }), 201

# Message routes
@app.route('/messages', methods=['GET', 'POST'])
def messages():
    if request.method == 'GET':
        messages = Message.query.order_by(Message.created_at.asc()).all()
        return jsonify([message.to_dict() for message in messages]), 200

    elif request.method == 'POST':
        data = request.get_json()

        if 'body' not in data or 'username' not in data:
            return jsonify({"error": "Body and username are required"}), 400

        new_message = Message(body=data['body'], username=data['username'])
        db.session.add(new_message)
        db.session.commit()

        socketio.emit('notification', new_message.to_dict(), broadcast=True)

        return jsonify(new_message.to_dict()), 201

@app.route('/messages/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def messages_by_id(id):
    message = Message.query.get_or_404(id)

    if request.method == 'GET':
        return jsonify(message.to_dict()), 200

    elif request.method == 'PATCH':
        data = request.get_json()
        if 'body' not in data:
            return jsonify({"error": "Body is required"}), 400
        message.body = data['body']
        db.session.commit()
        return jsonify(message.to_dict()), 200

    elif request.method == 'DELETE':
        db.session.delete(message)
        db.session.commit()
        return jsonify({"message": "Message deleted"}), 200

# Maintenance request routes
@app.route('/requests', methods=['GET', 'POST'])
def requests():
    if request.method == 'GET':
        requests = Request.query.order_by(Request.created_at.desc()).all()
        return jsonify([req.to_dict() for req in requests]), 200

    elif request.method == 'POST':
        data = request.get_json()
        if 'body' not in data:
            return jsonify({"error": "Request body is required"}), 400

        new_request = Request(body=data['body'])
        db.session.add(new_request)
        db.session.commit()

        return jsonify(new_request.to_dict()), 201

@app.route('/requests/<int:id>', methods=['GET', 'DELETE'])
def request_by_id(id):
    request = Request.query.get_or_404(id)

    if request.method == 'GET':
        return jsonify(request.to_dict()), 200

    elif request.method == 'DELETE':
        db.session.delete(request)
        db.session.commit()
        return jsonify({"message": "Request deleted"}), 200

# Comments/Feedback routes
@app.route('/comments', methods=['GET', 'POST'])
def comments():
    if request.method == 'GET':
        comments = CommentFeedback.query.all()
        return jsonify([comment.to_dict() for comment in comments]), 200

    elif request.method == 'POST':
        data = request.get_json()
        if 'body' not in data:
            return jsonify({"error": "Comment body is required"}), 400

        new_comment = CommentFeedback(body=data['body'])
        db.session.add(new_comment)
        db.session.commit()

        return jsonify(new_comment.to_dict)
    
if __name__ == '__main__':
    socketio.run(app, debug=True)