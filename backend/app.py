from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import jwt
import datetime
from functools import wraps
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'capstone'
app.config['SECRET_KEY'] = 'secret-key'


mysql = MySQL(app)

# Store OTPs temporarily (in production, use Redis or similar)
otp_store = {}

def send_otp_email(email, otp):
    # Configure your email settings
    sender_email = "disasterprediction37@gmail.com"
    sender_password = "Your-password"
    
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = email
    message["Subject"] = "Login OTP"
    
    body = f"Your OTP for login is: {otp}"
    message.attach(MIMEText(body, "plain"))
    
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(message)
        return True
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return False

# JWT token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user_id = data['user_id']
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        cur = mysql.connection.cursor()
        cur.execute("SELECT id FROM users WHERE email = %s AND password = %s", (email, password))
        user = cur.fetchone()
        cur.close()

        if user:
            token = jwt.encode({
                'user_id': user[0],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            },  app.config['SECRET_KEY'])
            
            return jsonify({
                'message': 'Login successful',
                'token': token
            })
        
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Server error occurred'}), 500

@app.route('/api/check-auth', methods=['GET'])
@token_required
def check_auth():
    return jsonify({'authenticated': True})

@app.route('/api/dashboard-data', methods=['GET'])
@token_required
def get_dashboard_data():
    return jsonify({'data': 'Your dashboard data here'})

@app.route('/api/request-otp', methods=['POST'])
def request_otp():
    try:
        data = request.json
        email = data.get('email')
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
            
        # Check if email exists in database
        cur = mysql.connection.cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()
        
        if not user:
            return jsonify({'error': 'No user found with this email'}), 404
            
        # Generate 6-digit OTP
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        # Store OTP with timestamp
        otp_store[email] = {
            'otp': otp,
            'timestamp': datetime.datetime.utcnow(),
            'attempts': 0
        }
        
        # Send OTP via email
        if send_otp_email(email, otp):
            return jsonify({'message': 'OTP sent successfully'})
        else:
            return jsonify({'error': 'Failed to send OTP'}), 500
            
    except Exception as e:
        print(f"OTP request error: {str(e)}")
        return jsonify({'error': 'Server error occurred'}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.json
        email = data.get('email')
        submitted_otp = data.get('otp')
        
        if not email or not submitted_otp:
            return jsonify({'error': 'Email and OTP are required'}), 400
            
        # Check if OTP exists and is valid
        otp_data = otp_store.get(email)
        if not otp_data:
            return jsonify({'error': 'No OTP request found'}), 400
            
        # Check OTP expiry (5 minutes)
        time_diff = datetime.datetime.utcnow() - otp_data['timestamp']
        if time_diff.total_seconds() > 300:  # 5 minutes
            del otp_store[email]
            return jsonify({'error': 'OTP expired'}), 400
            
        # Check attempts
        if otp_data['attempts'] >= 3:
            del otp_store[email]
            return jsonify({'error': 'Too many attempts'}), 400
            
        # Increment attempts
        otp_data['attempts'] += 1
        
        # Verify OTP
        if submitted_otp != otp_data['otp']:
            return jsonify({'error': 'Invalid OTP'}), 401
            
        # OTP is valid - get user details and generate token
        cur = mysql.connection.cursor()
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user[0],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        
        # Clear OTP data
        del otp_store[email]
        
        return jsonify({
            'message': 'Login successful',
            'token': token
        })
        
    except Exception as e:
        print(f"OTP verification error: {str(e)}")
        return jsonify({'error': 'Server error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True)
