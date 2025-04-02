from flask import Flask, jsonify
from flask_cors import CORS
from database import get_connection
from functions.pull_events import pull_events
from functions.registered_users import registered_users 

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": " Event Planner API is running!"})


@app.route("/api/events", methods=["GET"])
def handle_pull_events():
    return pull_events()

@app.route("/api/registered_users", meothods=["GET"])
def registered_users():
    return registered_users()

if __name__ == "__main__":
    app.run(debug=True)
