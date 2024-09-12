from app import app, db, Manager, Estate, House, Tenant, Staff, MaintenanceRequest, Payment, Receipt, CheckIn, Task
from datetime import datetime, time, timedelta

# Initialize the database
with app.app_context():
    db.create_all()

# Dummy data for Managers
managers = [
    Manager(email='manager1@example.com', phone='1234567890'),
    Manager(email='manager2@example.com', phone='0987654321')
]

# Dummy data for Estates
estates = [
    Estate(name='Greenwood Estate', location='123 Green St', manager=managers[0]),
    Estate(name='Lakeside Estate', location='456 Lake Rd', manager=managers[1])
]

# Dummy data for Houses
houses = [
    House(number='A1', floor=1, estate=estates[0]),
    House(number='A2', floor=1, estate=estates[0]),
    House(number='B1', floor=2, estate=estates[1]),
    House(number='B2', floor=2, estate=estates[1])
]

# Dummy data for Tenants
tenants = [
    Tenant(name='John Doe', email='john.doe@example.com', phone='1112223333', house=houses[0]),
    Tenant(name='Jane Smith', email='jane.smith@example.com', phone='4445556666', house=houses[1]),
    Tenant(name='Mike Johnson', email='mike.johnson@example.com', phone='7778889999', house=houses[2]),
    Tenant(name='Emily Davis', email='emily.davis@example.com', phone='0001112222', house=houses[3])
]

# Dummy data for Staff
staff = [
    Staff(name='David Brown', role='Cleaner', estate=estates[0], check_in_time=datetime.now(), check_out_time=datetime.now() + timedelta(hours=8)),
    Staff(name='Sarah Lee', role='Security', estate=estates[1], check_in_time=datetime.now(), check_out_time=datetime.now() + timedelta(hours=8)),
    Staff(name='Emma White', role='Manager Assistant', estate=estates[0], check_in_time=datetime.now(), check_out_time=datetime.now() + timedelta(hours=8)),
]

# Dummy data for Maintenance Requests
maintenance_requests = [
    MaintenanceRequest(description='Leaking faucet in kitchen', status='Pending', house=houses[0]),
    MaintenanceRequest(description='Broken window in bedroom', status='Completed', house=houses[1]),
]

# Dummy data for Tasks
tasks = [
    Task(staff=staff[0], maintenance_request=maintenance_requests[0]),
    Task(staff=staff[1], maintenance_request=maintenance_requests[1]),
]

# Dummy data for Payments
payments = [
    Payment(amount=1200.00, tenant=tenants[0]),
    Payment(amount=1300.00, tenant=tenants[1]),
    Payment(amount=1100.00, tenant=tenants[2]),
    Payment(amount=1500.00, tenant=tenants[3])
]

# Dummy data for Receipts
receipts = [
    Receipt(payment=payments[0]),
    Receipt(payment=payments[1]),
    Receipt(payment=payments[2]),
    Receipt(payment=payments[3])
]

# Dummy data for Check-Ins
check_ins = [
    CheckIn(staff=staff[0], check_in_time=datetime.now(), check_out_time=datetime.now() + timedelta(hours=8)),
    CheckIn(staff=staff[1], check_in_time=datetime.now(), check_out_time=datetime.now() + timedelta(hours=8)),
]

# Insert dummy data into the database
db.session.bulk_save_objects(managers)
db.session.bulk_save_objects(estates)
db.session.bulk_save_objects(houses)
db.session.bulk_save_objects(tenants)
db.session.bulk_save_objects(staff)
db.session.bulk_save_objects(maintenance_requests)
db.session.bulk_save_objects(tasks)
db.session.bulk_save_objects(payments)
db.session.bulk_save_objects(receipts)
db.session.bulk_save_objects(check_ins)

# Commit changes
db.session.commit()

print("Database seeded successfully!")