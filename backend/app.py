from flask import Flask, jsonify
from flask_cors import CORS
from database import get_connection
from functions.pull_events import pull_events
from functions.register_attendees import register_attendees
from functions.registered_users import registered_user
from functions.sort_attendees import export_attendees
from functions.event_setup import event_setup
from functions.login import login_user

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": " Event Planner API is running!"})

@app.route("/api/events", methods=["GET"])
def handle_pull_events():
    return pull_events()

@app.route("/api/event_setup", methods=["POST"])
def inserting_event():
    return event_setup()


@app.route("/api/rsvp", methods=["POST"])
def handle_register_attendees():
    return register_attendees()

@app.route("/api/register", methods=["POST"])
def registered_users():
    return registered_user()

@app.route("/api/export_attendees/<int:event_id>/<sort_field>", methods=["GET"])
def handle_export_attendees(event_id, sort_field):
    return export_attendees(event_id, sort_field)

@app.route("/api/login", methods=["POST"])
def handle_login():
    return login_user()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
