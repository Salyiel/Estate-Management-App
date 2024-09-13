from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from flask_socketio import SocketIO
from datetime import datetime
from flask_cors import CORS
import os
import random

app = Flask(__name__)
CORS(app)

# Configure Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///estate_management.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Email Configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'your_email@gmail.com')

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
mail = Mail(app)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

# Import models
from models import Manager, Estate, House, Tenant, Staff, Request, Task, Payment, Receipt, CheckIn, MaintenanceRequest, Message, CommentFeedback

# Welcome route
@app.route('/')
def welcome():
    return jsonify({'message': 'Welcome to the Estate Management App!'})

# Route to create manager
@app.route('/manager', methods=['POST'])
def create_manager():
    data = request.get_json()
    if not data or 'email' not in data or 'name' not in data:
        return jsonify({'message': 'Invalid data'}), 400
    new_manager = Manager(email=data['email'], name=data['name'])
    db.session.add(new_manager)
    db.session.commit()
    return jsonify({'message': 'Manager created successfully'}), 201

# Signup Route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Extracting data from the request
    email = data.get('email')
    password = data.get('password')

    # User creation logic
    new_user = Manager(
        email=email, 
        password=bcrypt.generate_password_hash(password).decode('utf-8'), 
        name=data.get('name')  # Ensure 'name' is provided
    )
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
    email = data.get('email')

    if not email:
        return jsonify({'error': 'Email is required'}), 400

    otp = generate_otp()

    # Send OTP to email
    try:
        msg = Message("Your OTP Code", recipients=[email])
        msg.body = f'Your OTP is {otp}'
        mail.send(msg)

        # Store the OTP in the database or cache
        manager = Manager.query.filter_by(email=email).first()
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
    # access_token = create_access_token(identity={'email': manager.email})

    # Clear OTP after successful login
    manager.otp = None
    db.session.commit()

    return jsonify({'message': 'Sign in successful'}), 200

# Endpoint to get tenant information
@app.route('/tenants', methods=['GET'])
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
def get_work_schedule():
    staff_id = request.args.get('staff_id')
    
    staff = Staff.query.filter_by(id=staff_id).first()
    if staff:
        schedule = {
            'date': staff.work_date.strftime('%Y-%m-%d'),
            'shift': f"{staff.shift_start.strftime('%I:%M %p')} - {staff.shift_end.strftime('%I:%M %p')}"
        }
        return jsonify(schedule), 200
    else:
        return jsonify({"error": "No work schedule found for this staff member"}), 404
    
# CheckinStatus route
@app.route('/check-in-status', methods=['GET'])
def check_in_status():
    staff_id = request.args.get('staff_id')
    latest_checkin = CheckIn.query.filter_by(staff_id=staff_id).order_by(CheckIn.id.desc()).first()
    
    if latest_checkin:
        checked_in = latest_checkin.check_in_time is not None and latest_checkin.check_out_time is None
        checked_out = latest_checkin.check_out_time is not None
        return jsonify({'checkedIn': checked_in, 'checkedOut': checked_out}), 200
    else:
        return jsonify({'checkedIn': False, 'checkedOut': False}), 200

# CheckIn Route
@app.route('/check-in', methods=['POST'])
def check_in():
    staff_id = request.json.get('staff_id')
    latest_checkin = CheckIn.query.filter_by(staff_id=staff_id).order_by(CheckIn.id.desc()).first()
    
    if latest_checkin and latest_checkin.check_in_time and latest_checkin.check_out_time is None:
        return jsonify({'error': 'Already checked in'}), 400

    new_checkin = CheckIn(staff_id=staff_id, check_in_time=datetime.utcnow())
    db.session.add(new_checkin)
    db.session.commit()

    return jsonify({'message': 'Checked in successfully'}), 200

# Checkout Route
@app.route('/check-out', methods=['POST'])
def check_out():
    staff_id = request.json.get('staff_id')
    latest_checkin = CheckIn.query.filter_by(staff_id=staff_id).order_by(CheckIn.id.desc()).first()

    if not latest_checkin or latest_checkin.check_out_time is not None:
        return jsonify({'error': 'No active check-in found'}), 400

    latest_checkin.check_out_time = datetime.utcnow()
    db.session.commit()

    return jsonify({'message': 'Checked out successfully'}), 200

# Endpoint to get maintenance requests
@app.route('/maintenance', methods=['GET'])
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
def create_payment():
    data = request.get_json()

    if not data or 'amount' not in data or 'date' not in data:
        return jsonify({'error': 'Amount and date are required'}), 400

    new_payment = Payment(
        amount=data['amount'],
        date=data['date']
    )
    db.session.add(new_payment)
    db.session.commit()

    return jsonify({
        'id': new_payment.id,
        'amount': new_payment.amount,
        'date': new_payment.date
    }), 201

# Message routes
@app.route('/messages', methods=['GET'])
def get_messages():
    messages = Message.query.all()
    messages_list = [{'id': message.id, 'body': message.body, 'created_at': message.created_at.isoformat()} for message in messages]
    return jsonify(messages_list), 200

@app.route('/messages', methods=['POST'])
def post_message():
    data = request.get_json()
    new_message = Message(body=data['body'], created_at=datetime.utcnow())
    db.session.add(new_message)
    db.session.commit()

    # Notify via SocketIO
    socketio.emit('new_message', {'body': new_message.body, 'created_at': new_message.created_at.isoformat()})
    return jsonify({'message': 'Message posted successfully'}), 201

# Comment Feedback route
@app.route('/feedback', methods=['POST'])
def post_feedback():
    data = request.get_json()
    new_feedback = CommentFeedback(
        comment=data['comment'], feedback_type=data['feedbackType'], timestamp=datetime.utcnow()
    )
    db.session.add(new_feedback)
    db.session.commit()

    return jsonify({'message': 'Feedback submitted successfully'}), 201

# Run app with SocketIO
if __name__ == '__main__':
    socketio.run(app, debug=True)