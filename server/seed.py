from app import app, db
from models import User, Payment, Notification, WorkSchedule, Task  # Add WorkSchedule and Task models
from datetime import datetime, time

# Create some sample data
users = [
    {"name": "John Doe", "email": "john.doe@example.com", "password": "password123", "position": "tenant", "phone": "123-456-7890"},
    {"name": "Bob Smith", "email": "bob.smith@example.com", "password": "password123", "position": "employee", "phone": "234-567-8901"},
    {"name": "Charlie Davis", "email": "charlie.davis@example.com", "password": "password123", "position": "manager", "phone": "345-678-9012"}
]

payments = [
    {"user_id": 1, "date": datetime(2024, 9, 1), "description": "Rent for September", "amount": 1200.00},
    {"user_id": 1, "date": datetime(2024, 8, 15), "description": "Electricity Bill", "amount": 150.00},
    {"user_id": 2, "date": datetime(2024, 9, 1), "description": "Rent for September", "amount": 1200.00}
]

notifications = [
    {"user_id": 1, "message": "Rent is due on the 1st of this month.", "is_read": False},
    {"user_id": 1, "message": "Electricity bill is due on the 15th of this month.", "is_read": True},
    {"user_id": 2, "message": "Wi-Fi bill due soon on the 20th.", "is_read": False},
    {"user_id": 2, "message": "Annual maintenance scheduled on the 10th.", "is_read": False},
]

work_schedules = [
    {"user_id": 2, "date": datetime(2024, 9, 15), "working_days": "Monday to Friday", "off_days": "Saturday, Sunday", "check_in_time": time(9, 0), "check_out_time": time(17, 0)},
]

tasks = [
    {"user_id": 2, "name": "Clean common areas", "is_primary": True},
    {"user_id": 2, "name": "Handle maintenance requests", "is_primary": True},
    {"user_id": 2, "name": "Review monthly reports", "is_primary": True},
    {"user_id": 2, "name": "Plan for upcoming events", "is_primary": True}
]

def seed_data():
    with app.app_context():
        # Clear existing data (optional if you want to start fresh)
        db.drop_all()
        db.create_all()

        # Add users
        for user_data in users:
            # Check if the user already exists by email
            existing_user = User.query.filter_by(email=user_data['email']).first()
            if existing_user is None:
                user = User(**user_data)
                db.session.add(user)

        # Commit users to the database
        db.session.commit()

        # Add payments
        for payment_data in payments:
            payment = Payment(**payment_data)
            db.session.add(payment)

        # Commit payments to the database
        db.session.commit()

        # Add notifications
        for notification_data in notifications:
            notification = Notification(**notification_data)
            db.session.add(notification)

        # Commit notifications to the database
        db.session.commit()

        # Add work schedules
        for schedule_data in work_schedules:
            work_schedule = WorkSchedule(**schedule_data)
            db.session.add(work_schedule)

        # Commit work schedules to the database
        db.session.commit()

        # Add tasks
        for task_data in tasks:
            task = Task(**task_data)
            db.session.add(task)

        # Commit tasks to the database
        db.session.commit()

        print("Database seeded with users, payments, notifications, work schedules, and tasks!")

if __name__ == "__main__":
    seed_data()
