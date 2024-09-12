from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Manager Model
class Manager(db.Model):
    __tablename__ = 'manager'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)

    estates = db.relationship('Estate', backref='manager', lazy=True)

# Estate Model
class Estate(db.Model):
    __tablename__ = 'estate'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('manager.id'), nullable=False)

    houses = db.relationship('House', backref='estate', lazy=True)
    staff = db.relationship('Staff', backref='estate', lazy=True)

# House (Apartment) Model
class House(db.Model):
    __tablename__ = 'house'
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(20), nullable=False)
    floor = db.Column(db.Integer, nullable=False)
    estate_id = db.Column(db.Integer, db.ForeignKey('estate.id'), nullable=False)

    tenants = db.relationship('Tenant', backref='house', lazy=True)
    maintenance_requests = db.relationship('Request', backref='house', lazy=True)

# Tenant Model
class Tenant(db.Model):
    __tablename__ = 'tenant'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    house_id = db.Column(db.Integer, db.ForeignKey('house.id'), nullable=False)

    payments = db.relationship('Payment', backref='tenant', lazy=True)

# Staff Model
class Staff(db.Model):
    __tablename__ = 'staff'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    check_in_time = db.Column(db.DateTime, nullable=True)
    check_out_time = db.Column(db.DateTime, nullable=True)
    estate_id = db.Column(db.Integer, db.ForeignKey('estate.id'), nullable=False)

    tasks = db.relationship('Task', backref='staff', lazy=True)
    check_ins = db.relationship('CheckIn', backref='staff', lazy=True)

# Maintenance Request Model
class Request(db.Model):
    __tablename__ = 'requests'
    id = db.Column(db.Integer, primary_key=True)
    request_description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Pending')
    date_submitted = db.Column(db.DateTime, default=datetime.utcnow)
    house_id = db.Column(db.Integer, db.ForeignKey('house.id'), nullable=False)

    tasks = db.relationship('Task', backref='request', lazy=True)

# Tasks Model (Many-to-Many between Staff and Requests)
class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    request_id = db.Column(db.Integer, db.ForeignKey('requests.id'), nullable=False)

# Payment Model
class Payment(db.Model):
    __tablename__ = 'payment'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)

    receipt = db.relationship('Receipt', backref='payment', uselist=False)

# Receipt Model
class Receipt(db.Model):
    __tablename__ = 'receipts'
    id = db.Column(db.Integer, primary_key=True)
    payment_id = db.Column(db.Integer, db.ForeignKey('payment.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

# CheckIn Model
class CheckIn(db.Model):
    __tablename__ = 'check_in'
    id = db.Column(db.Integer, primary_key=True)
    check_in_time = db.Column(db.DateTime, nullable=True)
    check_out_time = db.Column(db.DateTime, nullable=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)