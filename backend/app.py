# from flask import Flask, request, jsonify, render_template, Response, redirect
# from flask_cors import CORS
# from flask_mysqldb import MySQL
# import jwt
# import datetime
# from functools import wraps
# import random
# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart

# # Criminal detection dependencies
# import os, cv2, threading
# import numpy as np
# from PIL import Image
# from facenet_pytorch import MTCNN, InceptionResnetV1
# from sklearn.metrics.pairwise import cosine_similarity
# import torch

from flask import Flask, request, jsonify, render_template, Response, redirect, url_for, send_from_directory
from flask_cors import CORS
from flask_mysqldb import MySQL
from flask_mail import Mail, Message
import jwt
import datetime
from functools import wraps
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import cv2
import threading
import numpy as np
from PIL import Image
from facenet_pytorch import MTCNN, InceptionResnetV1
from sklearn.metrics.pairwise import cosine_similarity
import torch
from ultralytics import YOLO
import supervision as sv  # DeepSORT Tracking (ByteTrack)
from werkzeug.utils import secure_filename
import time




# app = Flask(__name__)
app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
CORS(app)

# MySQL Configuration
app.config['MYSQL_HOST'] = ''
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root1234' #root1234
app.config['MYSQL_DB'] = 'capstone'
app.config['SECRET_KEY'] = ''

app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Use your email service provider's SMTP server
app.config['MAIL_PORT'] = 587  # Port for outgoing email
app.config['MAIL_USE_TLS'] = True  # Use TLS encryption
app.config['MAIL_USERNAME'] = 'disasterprediction37@gmail.com'  # Your email address
app.config['MAIL_PASSWORD'] = ""  # Your email password

mail = Mail(app)

mysql = MySQL(app)

# Store OTPs temporarily (in production, use Redis or similar)
otp_store = {}

# ----------------------
# Detection Setup
UPLOAD_FOLDER = 'uploads'
KNOWN_FOLDER = 'known_faces'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(KNOWN_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config["ALLOWED_EXTENSIONS"] = {"mp4", "avi", "mov", "mkv"}
app.config['OUTPUT_FOLDER'] = 'static'
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)
crowd_video_path = ""


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
mtcnn = MTCNN(image_size=160, margin=20, keep_all=True, device=device)
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

known_embeddings = []
known_names = []
output_frame = None
video_path = None
use_webcam = False
lock = threading.Lock()

# Load YOLOv8 model (high accuracy version)
crowd_model = YOLO("yolov8x.pt")  # Extra-large model for better detection

crowd_lock = threading.Lock()
crowd_output_frame = None

# Initialize DeepSORT Tracker
tracker = sv.ByteTrack()

# Global variable for uploaded video path
crowd_video_path = None

# Check if the uploaded file is allowed
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]


# @app.route("/api/crowd-count/upload", methods=["POST"])
# def upload_crowd_video():
#     global crowd_video_path
#     if "video" not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files["video"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400
#     if not allowed_file(file.filename):
#         return jsonify({"error": "Invalid file type"}), 400
#     filename = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
#     file.save(filename)
#     crowd_video_path = filename
#     threading.Thread(target=count_crowd, daemon=True).start()
#     return jsonify({"message": "Video uploaded successfully"}), 200

@app.route('/api/crowd-count/upload', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video part'}), 400

    video = request.files['video']
    if video.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(video.filename)
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    video.save(input_path)

    # Process the video and save to OUTPUT_FOLDER as processed_output.mp4
    output_path = os.path.join(app.config['OUTPUT_FOLDER'], 'processed_output.mp4')
    process_video(input_path, output_path)

    return jsonify({'message': 'Video processed successfully'}), 200

def count_crowd():
    global crowd_video_path
    cap = cv2.VideoCapture(crowd_video_path)

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        # Run YOLO model
        results = crowd_model(frame, conf=0.1)
        if isinstance(results, list):
            results = results[0]

        # Convert YOLO results into Supervision detections
        detections = sv.Detections.from_ultralytics(results)

        # Filter detections for 'person' class only (COCO class ID 0)
        person_detections = detections[detections.class_id == 0]

        # Ensure detections are passed correctly to tracker
        if len(person_detections) > 0:
            tracked_objects = tracker.update_with_detections(person_detections)
        else:
            tracked_objects = []

        # Count number of people
        count = len(tracked_objects)

        # Draw bounding boxes
        for obj in tracked_objects:
            x1, y1, x2, y2 = map(int, obj[0])  # Extract bbox
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)  # Green box for people

        # Display People Count
        cv2.putText(frame, f"People Count: {count}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        # Save or display frame here for the frontend
        # You can implement frame streaming as done in the criminal detection section

    cap.release()

# @app.route('/api/crowd-count/video_feed')
# def crowd_video_feed():
#     def generate_frames():
#         global crowd_video_path
#         cap = cv2.VideoCapture(crowd_video_path)
#         while cap.isOpened():
#             success, frame = cap.read()
#             if not success:
#                 break
#             ret, buffer = cv2.imencode('.jpg', frame)
#             frame = buffer.tobytes()
#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
#         cap.release()
#     return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

# @app.route('/api/crowd-count/video_feed')
# def crowd_video_feed():
#     def generate_frames():
#         while True:
#             with crowd_lock:
#                 if crowd_output_frame is None:
#                     continue
#                 ret, buffer = cv2.imencode('.jpg', crowd_output_frame)
#                 frame = buffer.tobytes()
#             yield (b'--frame\r\n'
#                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
#     return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

@app.route('/api/crowd-count/video_feed')
def crowd_video_feed():
    return send_from_directory(app.config['OUTPUT_FOLDER'], 'processed_output.mp4')

def process_video(input_path, output_path):
    cap = cv2.VideoCapture(input_path)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Example crowd counting logic (dummy counter here)
        crowd_count = 42  # Replace with actual logic
        cv2.putText(frame, f'Crowd Count: {crowd_count}', (50, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        out.write(frame)

    cap.release()
    out.release()

#------------------------------------


def load_known_faces():
    known_embeddings.clear()
    known_names.clear()
    for filename in os.listdir(KNOWN_FOLDER):
        path = os.path.join(KNOWN_FOLDER, filename)
        name, _ = os.path.splitext(filename)
        img = Image.open(path).convert('RGB')
        face = mtcnn(img)
        if face is not None:
            if face.ndim == 3:
                face = face.unsqueeze(0)
            face = face.to(device)
            embedding = resnet(face).detach().cpu().numpy()
            known_embeddings.append(embedding)
            known_names.append(name)

load_known_faces()


# def count_crowd():
#     global crowd_video_path, crowd_use_webcam, crowd_output_frame
#     cap = cv2.VideoCapture(0 if crowd_use_webcam else crowd_video_path)

#     while cap.isOpened() and (crowd_use_webcam or crowd_video_path):
#         success, frame = cap.read()
#         if not success:
#             break

#         results = crowd_model.track(frame, persist=True, tracker="bytetrack.yaml")[0]
#         boxes = results.boxes.xyxy.cpu().numpy() if results.boxes else []
#         total_people = len(boxes)

#         # Draw bounding boxes
#         for box in boxes:
#             x1, y1, x2, y2 = map(int, box)
#             cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)

#         # Show count
#         cv2.putText(frame, f"Count: {total_people}", (10, 30),
#                     cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

#         with crowd_lock:
#             crowd_output_frame = frame.copy()

#     cap.release()


def match_face(face_tensor):
    if face_tensor.ndim == 3:
        face_tensor = face_tensor.unsqueeze(0)
    face_tensor = face_tensor.to(device)
    embedding = resnet(face_tensor).detach().cpu().numpy()
    identity = "Unknown"
    max_sim = 0.7
    for known_embedding, name in zip(known_embeddings, known_names):
        sim = cosine_similarity(embedding, known_embedding)[0][0]
        if sim > max_sim:
            max_sim = sim
            identity = name
    return identity

# def detect_faces():
#     global video_path, use_webcam, output_frame
#     cap = cv2.VideoCapture(0 if use_webcam else video_path)
#     process_interval = 5
#     frame_count = 0
#     last_boxes = []
#     last_names = []
#     while cap.isOpened():
#         success, frame = cap.read()
#         if not success:
#             break
#         frame_count += 1
#         rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         if frame_count % process_interval == 0:
#             img_pil = Image.fromarray(rgb)
#             boxes, _ = mtcnn.detect(img_pil)
#             last_boxes = boxes
#             last_names = []
#             if boxes is not None:
#                 faces = mtcnn(img_pil)
#                 for i, box in enumerate(boxes):
#                     if faces is None or i >= len(faces):
#                         last_names.append("Unknown")
#                         continue
#                     name = match_face(faces[i])
#                     last_names.append(name)
#         if last_boxes is not None:
#             for i, box in enumerate(last_boxes):
#                 if i >= len(last_names):
#                     continue
#                 name = last_names[i]
#                 x1, y1, x2, y2 = map(int, box)
#                 color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
#                 cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
#                 cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
#         with lock:
#             output_frame = frame.copy()
#     cap.release()


detection_running = False


def detect_faces():
    try:
        global video_path, use_webcam, output_frame, detection_running
        detection_running = True
        cap = cv2.VideoCapture(0 if use_webcam else video_path)
        process_interval = 5
        frame_count = 0
        last_boxes = []
        last_names = []
        if not use_webcam:
            while not cap.isOpened():
                pass  # wait until video is opened
        while cap.isOpened() and (use_webcam or video_path) and detection_running:
        #Add check to stop if use_webcam is False
            success, frame = cap.read()
            if not success:
                break
            frame_count += 1
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            if frame_count % process_interval == 0:
                img_pil = Image.fromarray(rgb)
                boxes, _ = mtcnn.detect(img_pil)
                last_boxes = boxes
                last_names = []
                if boxes is not None:
                    faces = mtcnn(img_pil)
                    for i, box in enumerate(boxes):
                        if faces is None or i >= len(faces):
                            last_names.append("Unknown")
                            continue
                        name = match_face(faces[i])
                        last_names.append(name)
            if last_boxes is not None:
                for i, box in enumerate(last_boxes):
                    if i >= len(last_names):
                        continue
                    name = last_names[i]
                    x1, y1, x2, y2 = map(int, box)
                    color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    cv2.putText(frame, name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
            with lock:
                output_frame = frame.copy()
        cap.release()
        #detection_running = False
    except Exception as e:
        print(f"Error in detection: {str(e)}")

# ----------------------------------------

def send_otp_email(email, otp):
    # Configure your email settings
    sender_email = "disasterprediction37@gmail.com"
    sender_password = "osibbsjgihevazwj"

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

# @app.route('/api/login', methods=['POST'])
# def login():
#     try:
#         data = request.json
#         email = data.get('email')
#         password = data.get('password')
#
#         cur = mysql.connection.cursor()
#         cur.execute("SELECT id FROM users WHERE email = %s AND password = %s", (email, password))
#         user = cur.fetchone()
#         cur.close()
#
#         if user:
#             token = jwt.encode({
#                 'user_id': user[0],
#                 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
#             },  app.config['SECRET_KEY'])
#
#             return jsonify({
#                 'message': 'Login successful',
#                 'token': token
#             })
#
#         return jsonify({'error': 'Invalid credentials'}), 401
#     except Exception as e:
#         print(f"Login error: {str(e)}")
#         return jsonify({'error': 'Server error occurred'}), 500

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

#-------------
@app.route('/api/criminal-detection', methods=['GET', 'POST'])
def criminal_index():
    global video_path, use_webcam
    if request.method == 'POST':
        if 'video' in request.files:
            file = request.files['video']
            if file.filename == '':
                return redirect(request.url)
            filepath = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filepath)
            video_path = filepath
            use_webcam = False
            print("Till this point")
            threading.Thread(target=detect_faces, daemon=True).start()
            print(f"Threads {threading}")
            import time
            timeout = 10  # seconds
            start_time = time.time()
            while output_frame is None and (time.time() - start_time) < timeout:
                time.sleep(0.1)

            return redirect('/api/criminal-detection/video_feed')
    return "<h3>Upload video via POST or click to start webcam</h3>"

@app.route('/api/criminal-detection/start_webcam', methods=['POST'])
def start_webcam():
    global use_webcam, video_path
    use_webcam = True
    video_path = None
    threading.Thread(target=detect_faces, daemon=True).start()
    return redirect('/api/criminal-detection/video_feed')

@app.route('/api/criminal-detection/video_feed')
def video_feed():
    def generate_frames():
        global output_frame
        while True:
            with lock:
                if output_frame is None:
                    time.sleep(0.1)
                    continue
                frame = output_frame.copy()
            ret, buffer = cv2.imencode('.jpg', frame)
            if not ret:
                continue
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/criminal-detection/stop_webcam', methods=['POST'])
def stop_webcam():
    global use_webcam
    use_webcam = False
    return jsonify({"status": "Webcam stopped"}), 200

@app.route('/api/criminal-detection/stop', methods=['POST'])
def stop_detection():
    global detection_running
    detection_running = False
    return jsonify({'message': 'Criminal detection stopped'}), 200


@app.route('/smtp_form', methods=['POST'])
def feedback():
    name = ""
    email = ""
    message = ""
    if request.method == 'POST':
        # Receiving data from the frontend
        name = request.json.get('name')
        email = request.json.get('email')
        message = request.json.get('message')

    student_email = ['aishwarya.bangar@mitaoe.ac.in', 'shubhan.ansari@mitaoe.ac.in', 'visharad.baderao@mitaoe.ac.in']

    # You can use the 'name' and 'email' fields to create a more personalized subject.
    subject = f"Feedback from {name} ({email})"

    msg = Message(subject, sender='your_email@gmail.com', recipients=student_email)
    msg.body = message

    try:
        mail.send(msg)
        return jsonify({'message': 'Email sent successfully!'}), 200
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        return jsonify({'error': 'Failed to send email'}), 500


#------------------


# Route to serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)

# if __name__ == '__main__':
#     app.run(debug=True)
