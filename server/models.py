from app import db
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timezone

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    position = db.Column(db.String(50), nullable=False)
    requests = db.relationship('Request', back_populates='user', lazy=True)
    payments = db.relationship('Payment', back_populates='user', lazy=True)
    feedbacks = db.relationship('Feedback', back_populates='user', lazy=True)
    notifications = db.relationship('Notification', back_populates='user', lazy=True)
    work_schedules = db.relationship('WorkSchedule', back_populates='user', lazy=True)
    tasks = db.relationship('Task', back_populates='user', lazy=True)
    check_in_outs = db.relationship('CheckInOut', back_populates='user', lazy=True)

    def __repr__(self):
        return f'<User {self.id}: {self.name} ({self.email})>'

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)

    user = db.relationship('User', back_populates='payments')

    def __repr__(self):
        return f'<Payment {self.id}: {self.description} (${self.amount})>'

class Request(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    body = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='pending')  # Default status is 'pending'
    user_name = db.Column(db.String(100), nullable=False)

    user = db.relationship('User', back_populates='requests')

    def __repr__(self):
        return f'<Request {self.id}: {self.body[:20]}... (Status: {self.status})>'

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_name = db.Column(db.String(100), nullable=False)  # Column to store user's name
    feedback = db.Column(db.Text, nullable=False)
    date_submitted = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    
    user = db.relationship('User', back_populates='feedbacks')

    def __repr__(self):
        return f'<Feedback {self.id}>'

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    date_sent = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'date_sent': self.date_sent.isoformat(),
            'is_read': self.is_read
        }

    user = db.relationship('User', back_populates='notifications')

    def __repr__(self):
        return f'<Notification {self.id}>'

class WorkSchedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    working_days = db.Column(db.String(50), nullable=False)
    off_days = db.Column(db.String(50), nullable=False)
    check_in_time = db.Column(db.Time, nullable=False)
    check_out_time = db.Column(db.Time, nullable=False)

    user = db.relationship('User', back_populates='work_schedules')

    def __repr__(self):
        return f'<WorkSchedule {self.id}>'

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    request_id = db.Column(db.Integer, db.ForeignKey('request.id'), nullable=True)

    user = db.relationship('User', back_populates='tasks')
    request = db.relationship('Request')

    def __repr__(self):
        return f'<Task {self.id}: {self.name} (Status: {self.status})>'

class CheckInOut(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    checked_in_at = db.Column(db.DateTime, nullable=True)
    checked_out_at = db.Column(db.DateTime, nullable=True)
    date_of_activity = db.Column(db.Date, default=datetime.utcnow().date())
    time_worked = db.Column(db.Interval, nullable=True)

    user = db.relationship('User', back_populates='check_in_outs')

    def __repr__(self):
        return f'<CheckInOut {self.id}: Checked in at {self.checked_in_at}, Checked out at {self.checked_out_at}>'
