from flask import Flask, render_template, request, redirect, url_for, session, flash
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load Supabase credentials from db.env
load_dotenv("db.env")

app = Flask(__name__)
app.secret_key = "secret"  # Safe for development

# Supabase config
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/', methods=['GET', 'POST'])
def login_register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        # Login block
        if 'login' in request.form:
            try:
                res = supabase.auth.sign_in_with_password({"email": email, "password": password})
                if res.session is not None:
                    session['user'] = email
                    return redirect(url_for('dashboard'))
                else:
                    flash("Login failed. Invalid credentials.", "danger")
            except Exception as e:
                flash("Login failed: " + str(e), "danger")

        # Registration block
        elif 'register' in request.form:
            try:
                res = supabase.auth.sign_up({"email": email, "password": password})
                if res.user is not None:
                    supabase.table("accounts").insert({"username": email,"password": password}).execute()

                    flash("Registered successfully! Please log in.", "success")
                else:
                    flash("Registration failed. Try again.", "danger")
            except Exception as e:
                flash("Registration failed: " + str(e), "danger")

    return render_template('login.html')


#@app.route('/dashboard')
#def dashboard():
  #  if 'user' not in session:
    #    return redirect(url_for('login_register'))
    #return render_template('dashboard.html', email=session['user'])
@app.route('/dashboard')
def dashboard():
    images = sample_images  # replace with your Supabase logic later
    return render_template("dashboard.html", images=images)



@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login_register'))

sample_images = [
    {
        "id": 101,
        "url": "https://th.bing.com/th/id/OIP.W3iyYI-Bfs-xuQcunZjkKwHaFN?r=0&w=720&h=507&rs=1&pid=ImgDetMain",
        "latitude": 12.823111,
        "longitude": 77.514111,
        "count":2
    },
    {
        "id": 102,
        "url": "https://th.bing.com/th/id/OIP.5RZw38h0XJSzs-uOYiSKCQHaLG?r=0&w=683&h=1024&rs=1&pid=ImgDetMain",
        "latitude": 12.824222,
        "longitude": 77.515222,
        "count":2
    },
    {
        "id": 103,
        "url": "https://th.bing.com/th/id/OIP.w65r1WPb0UKVOsrVzb7fKAHaE7?r=0&w=1920&h=1278&rs=1&pid=ImgDetMain",
        "latitude": 12.825333,
        "longitude": 76.516333,
        "count":1
    },
    {
        "id": 104,
        "url": "https://www.abetterlifeokc.com/clientuploads/blog/pothole_street_repair_road_construction_(2).jpg",
        "latitude": 13.826444,
        "longitude": 77.517444,
        "count":1
    },
    {
        "id": 105,
        "url": "https://townsquare.media/site/696/files/2019/02/Potholes.jpg?w=1200&h=0&zc=1&s=0&a=t&q=89",
        "latitude": 12.827555,
        "longitude": 78,
        "count":5
    }
]
import google.generativeai as genai
from flask import request, jsonify
from PIL import Image
import requests
from io import BytesIO


genai.configure(api_key="AIzaSyDQqPy90Xa7LXzYwBBL8AmYn65T_hyITv8")
model = genai.GenerativeModel("gemini-1.5-flash")


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    image_url = data.get("image_url")

    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400

    try:
        # Download image from URL
        response = requests.get(image_url)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content))

        prompt = (
            "Give me recurrence material and repair cost in total of all potholes in this image "
            "in format:\nmaterial: <>\ncost: <>" 
            "nothing extra to be written just give approximation and u have to give material and cost no matter"
        )

        result = model.generate_content([prompt, image])
        return jsonify({"result": result.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500




if __name__ == '__main__':
    app.run(debug=True)
