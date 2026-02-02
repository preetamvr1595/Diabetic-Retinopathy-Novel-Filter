from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, User
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength - at least 8 characters"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    return True, "Valid"

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Register a new user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        username = data.get('username', '').strip()
        
        # Validation
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        if not validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        is_valid, msg = validate_password(password)
        if not is_valid:
            return jsonify({"error": msg}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409
        
        # Create new user
        new_user = User(email=email, username=username if username else None)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "message": "User registered successfully",
            "user": new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return JWT token"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Generate JWT tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user info"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({"user": user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=user_id)
        
        return jsonify({"access_token": new_access_token}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
