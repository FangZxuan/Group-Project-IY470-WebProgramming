from flask import Flask, request, render_template, url_for, redirect, render_template_string
import mysql.connector
import random

app = Flask(__name__)

DB_CONFIG = {
    "host": "localhost",
    "user": "austin",
    "password": "55231125Ab!ab",
    "database": "papi",
    "raise_on_warnings": True,
}


def get_connection():
    return mysql.connector.connect(**DB_CONFIG)
@app.route("/")
def index():
    return render_template('index.html')
@app.route('/membership')
def membership():
    return render_template('membership.html')

@app.route('/confirm')
def confirm():
    return render_template('confirmation.html')

# Serve the signup page
@app.route("/account")
def account_page():
    return render_template("account.html")
 #  this file is in "templates" folder
@app.route("/signup")
def signup_page():
    return render_template("signup.html") 

def email_exists(email):
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT 1 FROM Account WHERE email = %s LIMIT 1",
            (email,)
        )
        return cur.fetchone() is not None
    finally:
        cur.close()
        conn.close()
# Handle form submission

@app.route("/submit", methods=["POST"])

def submit():
    email = request.form.get("email","").strip()
    fname = request.form.get("fname","").strip()
    Lname = request.form.get("Lname","").strip()
    pass_word = request.form.get("pass_word","").strip()
    membership = request.form.get("membership")

    membership_id = random.randint(100000, 999999)

    if not email or not fname or not Lname or not pass_word:
        return "Missing required fields", 400
    
    if email_exists(email):
        return render_template(
            "message.html",
            message="Email already registered!",
            redirect_url= url_for("signup_page")
        )
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO Account (EMAIL, First_Name, Last_Name,Password, MembershipID) VALUES (%s, %s, %s, %s, %s)",
            (email, fname, Lname, pass_word, membership_id),
        )
        conn.commit()
    finally:
        cur.close()
        conn.close()
    return render_template("signup.html", membership_id = membership_id)
      

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
