from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_socketio import SocketIO
from config import Config

# Initialize Flask app and extensions
app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return "Welcome to the estate Manage System"

@socketio.on('connect')
def handle_connect():
    print("Client connected")

@socketio.on('disconnect')
def handle_disconnect():
    print("Client disconnected")

@socketio.on('message')
def handle_message(message):
    print("Received message: ", message)

# Import routes after initializing app and extensions
from routes import *  # Import routes to register them with the app

# Run the app using SocketIO
if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5555, debug=True)

