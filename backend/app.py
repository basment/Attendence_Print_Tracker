from flask import Flask, jsonify
from flask_cors import CORS
from database import get_connection
from functions.pull_events import pull_events
from functions.register_attendees import register_attendees

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": " Event Planner API is running!"})


@app.route("/api/events", methods=["GET"])
def handle_pull_events():
    return pull_events()

@app.route("/api/rsvp", methods=["POST"])
def handle_register_attendees():
    return register_attendees()

if __name__ == "__main__":
    app.run(debug=True)
