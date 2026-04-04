from flask import Flask, request, render_template, url_for
import mysql.connector

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

# Serve the signup page
@app.route("/")
def account_page():
    return render_template("account.html")
 #  this file is in "templates" folder
@app.route("/signup.html")
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

    if not email or not fname or not Lname:
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
            "INSERT INTO Account (email, fname, Lname) VALUES (%s, %s, %s)",
            (email, fname, Lname),
        )
        conn.commit()
    finally:
        cur.close()
        conn.close()

    return "Saved to database."

if __name__ == "__main__":
    app.run(debug=True)
