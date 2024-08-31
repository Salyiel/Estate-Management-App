# **Estate Management System**

## **Overview**

The Estate Management System is a full-stack web application designed to streamline the management of residential estates or apartment complexes. It simplifies tasks such as tracking tenant information, managing staff check-ins, handling maintenance requests, and securing data access through encryption and OTP verification.

## **Features**

- **Tenant Information Management:** View and manage tenant details and billing information.
- **Staff Check-In:** Track staff check-ins and check-outs.
- **Comments and Feedback:** Tenants and staff can leave comments and suggestions.
- **Maintenance Requests:** Tenants can submit maintenance requests, which are sent to the admin in real-time.
- **Data Security:** Secure data storage with encryption and OTP verification for user access.

## **Technologies Used**

### **Frontend**
- **React**: For building the user interface.
- **Axios**: For making HTTP requests to the backend.
- **Socket.IO**: For real-time communication between users and the admin.

### **Backend**
- **Flask**: A micro web framework for Python.
- **SQLAlchemy**: ORM for database management.
- **Flask-SocketIO**: To implement real-time features.
- **Flask-SQLAlchemy**: Integration of Flask with SQLAlchemy.
- **Flask-Bcrypt**: For password hashing and data encryption.
- **Flask-JWT-Extended**: For handling JSON Web Tokens (JWTs) for user authentication.
- **Flask-Mail**: For sending OTPs via email.

### **Database**
- **SQLite**: A lightweight database for development (can be switched to PostgreSQL or MySQL for production).

## **Setup Instructions**

### **Prerequisites**
- **Python 3.8+**
- **Node.js 14+**
- **npm 6+ or Yarn**
- **Virtualenv (optional but recommended)**

### **Backend Setup**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/estate-management-system.git
   cd estate-management-system/server
   ```

2. **Create a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup the database:**
   ```bash
   flask db init
   flask db migrate -m "Initial migration."
   flask db upgrade
   ```

5. **Run the Flask development server:**
   ```bash
   flask run
   ```

### **Frontend Setup**

1. **Navigate to the client directory:**
   ```bash
   cd ../client
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

### **Real-time Notifications Setup**
To enable real-time notifications using WebSockets:

1. **Ensure `Flask-SocketIO` is installed in your backend environment.**

2. **Update your Flask app to use SocketIO as shown in the backend setup.**

3. **Make sure to include the SocketIO client in your React app.**

### **Environment Variables**

Set the following environment variables in a `.env` file or in your environment:

```bash
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
SQLALCHEMY_DATABASE_URI=sqlite:///app.db
JWT_SECRET_KEY=your_jwt_secret_key
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_email_password
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=1
```

### **Running Tests**

To run tests:

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Run the tests:**
   ```bash
   pytest
   ```

## **MVP (Minimum Viable Product)**

1. **User Authentication**: Implement secure login and registration with JWT authentication and OTP verification.
2. **Tenant Management**: CRUD operations for tenant data, including encrypted storage of sensitive information.
3. **Staff Check-In/Check-Out**: A simple interface for tracking staff attendance.
4. **Maintenance Request System**: Tenants can submit maintenance requests, which will be forwarded to the admin in real-time.
5. **Comments and Feedback System**: An interface for tenants and staff to leave comments and suggestions.

## **User Stories**

### **As a Tenant:**
- I want to log in securely using OTP so that my information remains private.
- I want to submit maintenance requests and track their status so that I can ensure my issues are addressed promptly.
- I want to view my billing information and payment history so that I can stay on top of my finances.

### **As an Estate Manager:**
- I want to manage tenant information efficiently so that I can keep records up-to-date.
- I want to track staff attendance to ensure that all shifts are covered.
- I want to receive real-time notifications about maintenance requests so that I can address them promptly.

### **As a Staff Member:**
- I want to log in and check in/out for my shifts so that my attendance is accurately recorded.
- I want to leave feedback about my work environment so that the management can address any issues.

## **Sustainable Development Goals (SDGs) Addressed**

- **Goal 9: Industry, Innovation, and Infrastructure**: By creating a digital system that optimizes the management of residential estates, the app fosters innovation and contributes to the development of robust infrastructure.
- **Goal 11: Sustainable Cities and Communities**: The app improves the management and operation of residential estates, contributing to more sustainable and resilient communities.
- **Goal 16: Peace, Justice, and Strong Institutions**: By securing data and improving transparency in operations, the app helps in building strong and effective institutions at the community level.

## **Contributing**

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
