from flask import Flask, request, jsonify, session, redirect, url_for, flash
from app import app, db
from models import User, Payment, Request, Feedback, Notification, WorkSchedule, Task, CheckInOut
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from datetime import datetime
from dateutil import parser
import pytz
import logging
logging.basicConfig(level=logging.DEBUG)


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    try:
        user = User(
            name=data['name'],
            email=data['email'],
            password=data['password'],  # In a real app, hash the password before storing
            position=data['position'],
            phone=data['phone']  # Include phone number for completeness
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User signed up successfully"}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Email already exists"}), 400

@app.route('/signin', methods=['POST'])
def signin():
    data = request.json
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        return jsonify({
            "position": user.position,
            "user_id": user.id,
            "user_name": user.name
        }), 200
    return jsonify({"message": "Invalid email or password"}), 401


@app.route('/tenants', methods=['GET'])
def get_tenant_info():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID not provided'}), 400

    tenant = User.query.filter_by(id=user_id, position='tenant').first()

    if not tenant:
        return jsonify({'error': 'Tenant not found'}), 404

    payment_history = Payment.query.filter_by(user_id=tenant.id).all()

    tenant_data = {
        'name': tenant.name,
        'email': tenant.email,
        'phone': tenant.phone,
        'payment_history': [
            {'date': payment.date.strftime('%Y-%m-%d'), 'description': payment.description, 'amount': payment.amount}
            for payment in payment_history
        ]
    }

    return jsonify(tenant_data)


@app.route('/payments', methods=['POST'])
def create_payment():
    try:
        data = request.json
        user_id = data.get('userId')  # Retrieve user ID from the request data
        amount = data.get('amount')
        date = data.get('date')
        description = data.get('paymentType')

        if not all([user_id, amount, date, description]):
            raise ValueError("Missing required fields")

        new_payment = Payment(
            user_id=user_id,
            date=datetime.strptime(date, '%Y-%m-%d'),  # Convert date string to datetime
            description=description,
            amount=float(amount)
        )

        db.session.add(new_payment)
        db.session.commit()

        return jsonify({'message': 'Payment created successfully', 'payment': {
            'amount': new_payment.amount,
            'description': new_payment.description
        }}), 201

    except Exception as e:
        db.session.rollback()  # Rollback any changes if there's an error
        return jsonify({'error': str(e)}), 500


@app.route('/requests', methods=['POST'])
def create_request():
    try:
        data = request.json
        body = data.get('body')
        user_id = data.get('user_id')  # Retrieve user ID from the request data
        user_name = data.get('user_name')

        if not all([body, user_id, user_name]):
            raise ValueError("Missing required fields")

        new_request = Request(
            user_id=user_id,
            body=body,
            status='pending',  # Default status is 'pending'
            user_name=user_name
        )

        db.session.add(new_request)
        db.session.commit()

        return jsonify({'message': 'Request created successfully', 'request': {
            'body': new_request.body,
            'status': new_request.status
        }}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    

@app.route('/requests/<int:user_id>', methods=['GET'])
def get_requests(user_id):
    requests = Request.query.filter_by(user_id=user_id).all()
    requests_list = [{'body': req.body, 'status': req.status, 'user_name': req.user_name} for req in requests]
    return jsonify(requests_list), 200


@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    user_id = data.get('user_id')
    feedback_text = data.get('feedback')
    user_name = data.get('user_name')  # Ensure this field is included in the data

    if not feedback_text or not user_id or not user_name:
        return jsonify({"message": "Feedback, user ID, and user name are required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    feedback = Feedback(user_id=user_id, feedback=feedback_text, user_name=user_name)
    
    try:
        db.session.add(feedback)
        db.session.commit()
        return jsonify({"message": "Feedback submitted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500
    

@app.route('/notifications/unread', methods=['GET'])
def get_unread_notifications():
    user_id = request.args.get('user_id')
    notifications = Notification.query.filter_by(user_id=user_id, is_read=False).all()
    return jsonify([notification.to_dict() for notification in notifications])

@app.route('/notifications/mark_read', methods=['POST'])
def mark_notifications_as_read():
    user_id = request.json.get('user_id')
    notifications = Notification.query.filter_by(user_id=user_id, is_read=False).all()
    for notification in notifications:
        notification.is_read = True
        db.session.add(notification)
    db.session.commit()
    return jsonify({"message": "Notifications marked as read"})

@app.route('/notifications/all', methods=['GET'])
def get_all_notifications():
    user_id = request.args.get('user_id')
    notifications = Notification.query.filter_by(user_id=user_id).all()
    return jsonify([notification.to_dict() for notification in notifications])

@app.route('/api/work-schedule/<int:user_id>', methods=['GET'])
def get_work_schedule(user_id):
    work_schedule = WorkSchedule.query.filter_by(user_id=user_id).first()
    if work_schedule:
        return jsonify({
            'date': work_schedule.date.isoformat(),
            'working_days': work_schedule.working_days,
            'off_days': work_schedule.off_days,
            'check_in_time': work_schedule.check_in_time.isoformat() if work_schedule.check_in_time else None,
            'check_out_time': work_schedule.check_out_time.isoformat() if work_schedule.check_out_time else None
        })
    return jsonify({'message': 'No work schedule found'}), 404

@app.route('/api/tasks/<int:user_id>', methods=['GET'])
def get_tasks(user_id):
    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': task.id,
        'name': task.name,
        'is_primary': task.is_primary,
        'request_id': task.request_id
    } for task in tasks])

@app.route('/api/tenant-requests', methods=['GET'])
def get_pending_requests():
    # Fetch all requests with the status 'pending'
    pending_requests = Request.query.filter_by(status='pending').all()
    
    # Prepare the response
    result = []
    for r in pending_requests:
        result.append({
            'id': r.id,
            'user_id': r.user_id,
            'user_name': r.user_name,
            'body': r.body,
            'status': r.status
        })
    
    return jsonify(result), 200


@app.route('/api/all-tenant-requests', methods=['GET'])
def get_all_requests():
    try:
        # Fetch all requests (both pending and completed)
        all_requests = Request.query.all()
        
        # Prepare the response
        result = []
        for r in all_requests:
            result.append({
                'id': r.id,
                'user_id': r.user_id,
                'user_name': r.user_name,
                'body': r.body,
                'status': r.status
            })
        
        return jsonify(result), 200
    except Exception as e:
        print(f"Error in /api/tenant-requests route: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/check-in', methods=['POST'])
def check_in():
    data = request.json
    user_id = data.get('user_id')
    checked_in_at = data.get('checked_in_at')

    try:
        checked_in_at_datetime = parser.isoparse(checked_in_at)  # Use parser.isoparse for ISO 8601 strings
        check_in_record = CheckInOut(
            user_id=user_id,
            checked_in_at=checked_in_at_datetime,
            date_of_activity=checked_in_at_datetime.date()
        )
        db.session.add(check_in_record)
        db.session.commit()
        return jsonify({'message': 'Checked in successfully'}), 200
    except (ValueError, TypeError) as e:
        db.session.rollback()
        return jsonify({'error': 'Invalid date format or data type'}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/api/check-out', methods=['POST'])
def check_out():
    data = request.json
    user_id = data.get('user_id')
    checked_out_at = data.get('checked_out_at')

    try:
        checked_out_at_datetime = parser.isoparse(checked_out_at)
        
        check_in_record = CheckInOut.query.filter_by(user_id=user_id, checked_out_at=None).first()

        if not check_in_record:
            return jsonify({'message': 'No check-in record found'}), 400

        if check_in_record.checked_in_at:
            if check_in_record.checked_in_at.tzinfo is None:
                check_in_record.checked_in_at = pytz.utc.localize(check_in_record.checked_in_at)
            if checked_out_at_datetime.tzinfo is None:
                checked_out_at_datetime = pytz.utc.localize(checked_out_at_datetime)
            
            check_in_record.checked_out_at = checked_out_at_datetime
            check_in_record.time_worked = check_in_record.checked_out_at - check_in_record.checked_in_at
        
        db.session.commit()
        return jsonify({'message': 'Checked out successfully'}), 200
    except (ValueError, TypeError) as e:
        db.session.rollback()
        return jsonify({'error': 'Invalid date format or data type'}), 400
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/api/check-in-out-history', methods=['GET'])
def check_in_out_history():
    user_id = request.args.get('user_id')

    try:
        records = CheckInOut.query.filter_by(user_id=user_id).all()
        result = []
        for record in records:
            result.append({
                'date_of_activity': record.date_of_activity,
                'checked_in_at': record.checked_in_at,
                'checked_out_at': record.checked_out_at,
                'time_worked': str(record.time_worked)  # Convert interval to string
            })
        return jsonify(result), 200
    except SQLAlchemyError as e:
        app.logger.error(f'Database error: {e}')
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        app.logger.error(f'Unexpected error: {e}')
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/api/check-in-status', methods=['GET'])
def check_in_status():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    try:
        # Fetch the most recent check-in record for the user
        check_in_record = CheckInOut.query.filter_by(user_id=user_id).order_by(CheckInOut.id.desc()).first()

        if check_in_record:
            checked_in = check_in_record.checked_in_at is not None and check_in_record.checked_out_at is None
            checked_out = check_in_record.checked_out_at is not None
        else:
            checked_in = False
            checked_out = False

        return jsonify({'checkedIn': checked_in, 'checkedOut': checked_out}), 200
    except SQLAlchemyError as e:
        app.logger.error(f'Database error: {e}')
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        app.logger.error(f'Unexpected error: {e}')
        return jsonify({'error': 'Internal Server Error'}), 500
    

@app.route('/api/tenant-requests/<int:request_id>', methods=['PATCH'])
def update_request_status(request_id):
    data = request.get_json()
    request_status = data.get('status')

    tenant_request = Request.query.get(request_id)

    if not tenant_request:
        return jsonify({"error": "Request not found"}), 404

    # Update the status
    tenant_request.status = request_status
    db.session.commit()

    return jsonify({"message": "Request status updated successfully"}), 200

@app.route('/tenants-list', methods=['GET'])
def get_tenants():
    try:
        tenants = User.query.filter_by(position='tenant').all()
        tenants_list = []
        for tenant in tenants:
            # Fetch the most recent payment
            most_recent_payment = Payment.query.filter_by(user_id=tenant.id).order_by(Payment.date.desc()).first()
            payment_amount = most_recent_payment.amount if most_recent_payment else 0
            most_recent_bill = Payment.query.filter_by(user_id=tenant.id).order_by(Payment.date.desc()).first()
            payment_bill = most_recent_payment.description if most_recent_bill else 0
            tenants_list.append({
                'id': tenant.id,
                'name': tenant.name,
                'email': tenant.email,
                'most_recent_payment': payment_amount,
                'most_recent_bill': payment_bill
            })
        return jsonify(tenants_list)
    except Exception as e:
        print(f"Error in /tenants route: {e}")
        return jsonify({'error': str(e)}), 400


@app.route('/staff-list', methods=['GET'])
def get_staff():
    staff = User.query.filter_by(position='employee').all()
    staff_list = [
        {
            'id': member.id,
            'name': member.name,
            'shift': member.work_schedules[0].working_days if member.work_schedules else 'No schedule available',
            'hoursWorked': sum([cio.time_worked.total_seconds() / 3600 for cio in member.check_in_outs])
        }
        for member in staff
    ]
    return jsonify(staff_list)


@app.route('/tenant-management-data', methods=['GET'])
def get_tenant_management_data():
    try:
        # Query all tenants
        tenants = User.query.filter_by(position='tenant').all()
        
        # Prepare the response list
        tenants_list = []
        for tenant in tenants:
            # Fetch all payments for the tenant
            payments = Payment.query.filter_by(user_id=tenant.id).order_by(Payment.date.desc()).all()
            payments_list = [{'date': payment.date.strftime('%Y-%m-%d'), 'amount': payment.amount, 'description': payment.description} for payment in payments]
            
            tenants_list.append({
                'id': tenant.id,
                'name': tenant.name,
                'email': tenant.email,
                'payments': payments_list
            })
        
        return jsonify(tenants_list)
    except Exception as e:
        print(f"Error in /tenant-management-data route: {e}")
        return jsonify({'error': str(e)}), 400


@app.route('/api/send-notification', methods=['POST'])
def send_notification():
    print("Notification route hit!")  # Debugging line
    data = request.get_json()

    # Extract content and recipient from the request
    content = data.get('content')
    recipient = data.get('recipient')

    if not content:
        return jsonify({'error': 'Notification content is required'}), 400

    try:
        if recipient == 'everyone':
            # Fetch all users
            users = User.query.all()

            # Send a notification to each user
            for user in users:
                new_notification = Notification(
                    user_id=user.id,
                    message=content,
                    date_sent=datetime.utcnow()
                )
                db.session.add(new_notification)

        else:
            # Handle specific recipient by name
            user = User.query.filter_by(name=recipient).first()

            if not user:
                return jsonify({'error': 'Recipient not found'}), 404

            # Create a new notification for the specific user
            new_notification = Notification(
                user_id=user.id,
                message=content,
                date_sent=datetime.utcnow()
            )
            db.session.add(new_notification)

        # Commit all changes to the database
        db.session.commit()

        return jsonify({'message': 'Notification sent successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to send notification', 'details': str(e)}), 500
    

@app.route('/api/feedbacks', methods=['GET'])
def get_feedbacks():
    try:
        feedbacks = Feedback.query.all()
        feedback_list = [
            {
                'id': f.id,
                'user_name': f.user_name,
                'feedback': f.feedback,
                'date_submitted': f.date_submitted.isoformat()
            } for f in feedbacks
        ]
        return jsonify(feedback_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/sign-out', methods=['POST'])
def sign_out():
    """Sign out the user by clearing the session."""
    # Clear the session data
    session.pop('user_id', None)
    session.pop('user_name', None)

    # Optionally, flash message for the sign-out action
    flash('You have been signed out.', 'success')

    # Redirect to the sign-in page
    return redirect(url_for('signin'))