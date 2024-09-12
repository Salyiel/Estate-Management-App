from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_mail import Mail, Message
from flask_socketio import SocketIO, emit
from datetime import timedelta
from flask_cors import CORS
import os
 
app = Flask(__name__)
CORS(app)

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

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mail = Mail(app)
socketio = SocketIO(app)


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
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    # Extracting data from the request
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    position = data.get('position')

    # You can add your user creation logic here (e.g., save to the database)
    new_user = Manager(name=name, email=email, password=bcrypt.generate_password_hash(password).decode('utf-8'), position=position)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201


# Login route with JWT
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    phone = data.get('phone')  # Simulate OTP sent to phone
    # Here you would verify the OTP sent to the phone

    if not email or not phone:
        return jsonify({'message': 'Invalid data'}), 400

    manager = Manager.query.filter_by(email=email).first()
    if not manager:
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity={'email': manager.email})
    return jsonify(access_token=access_token)

# Endpoint to get tenant information
@app.route('/api/tenants', methods=['GET'])
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
@app.route('/api/staff', methods=['GET'])
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
@app.route('/api/work-schedule', methods=['GET'])
@jwt_required()
def get_work_schedule():
    # Assuming staff_id is the identity stored in JWT during login
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
@app.route('/api/maintenance', methods=['GET'])
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
@app.route('/api/payments', methods=['POST'])
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
    # Handle GET request: Return all messages
    if request.method == 'GET':
        messages = Message.query.order_by(Message.created_at.asc()).all()
        return jsonify([message.to_dict() for message in messages]), 200

    # Handle POST request: Create a new message
    elif request.method == 'POST':
        data = request.get_json()

        if 'body' not in data or 'username' not in data:
            return jsonify({"error": "Body and username are required"}), 400

        new_message = Message(body=data['body'], username=data['username'])
        db.session.add(new_message)
        db.session.commit()

        # Emit the new message to all connected clients
        socketio.emit('notification', new_message.to_dict(), broadcast=True)

        return jsonify(new_message.to_dict()), 201

@app.route('/messages/<int:id>', methods=['GET', 'PATCH', 'DELETE'])
def messages_by_id(id):
    # Fetch the message by ID
    message = Message.query.get_or_404(id)

    # Handle GET request: Return the message as JSON
    if request.method == 'GET':
        return jsonify(message.to_dict()), 200

    # Handle PATCH request: Update the message body
    elif request.method == 'PATCH':
        data = request.get_json()
        if 'body' not in data:
            return jsonify({"error": "Body is required"}), 400
        message.body = data['body']
        db.session.commit()
        return jsonify(message.to_dict()), 200

    # Handle DELETE request: Delete the message
    elif request.method == 'DELETE':
        db.session.delete(message)
        db.session.commit()
        return jsonify({"message": "Message deleted"}), 200
    

@app.route('/api/requests', methods=['GET', 'POST'])
def requests():
    # Handle GET request: Return all requests
    if request.method == 'GET':
        requests = Request.query.order_by(Request.created_at.desc()).all()
        return jsonify([req.to_dict() for req in requests]), 200

    # Handle POST request: Create a new request
    elif request.method == 'POST':
        data = request.get_json()
        if 'body' not in data:
            return jsonify({"error": "Request body is required"}), 400

        new_request = Request(body=data['body'])
        db.session.add(new_request)
        db.session.commit()

        return jsonify(new_request.to_dict()), 201

@app.route('/api/requests/<int:id>', methods=['GET', 'DELETE'])
def request_by_id(id):
    request = Request.query.get_or_404(id)

    if request.method == 'GET':
        return jsonify(request.to_dict()), 200

    elif request.method == 'DELETE':
        db.session.delete(request)
        db.session.commit()
        return jsonify({"message": "Request deleted"}), 200


@app.route('/api/comments', methods=['GET', 'POST'])
def comments():
    # Handle GET request: Return all comments/feedback
    if request.method == 'GET':
        comments = CommentFeedback.query.all()
        return jsonify([comment.to_dict() for comment in comments]), 200

    # Handle POST request: Create a new comment/feedback
    elif request.method == 'POST':
        data = request.get_json()
        if 'body' not in data:
            return jsonify({"error": "Comment body is required"}), 400

        new_comment = CommentFeedback(body=data['body'])
        db.session.add(new_comment)
        db.session.commit()

        return jsonify(new_comment.to_dict()), 201

if __name__ == '__main__':
    socketio.run(app, debug=True)