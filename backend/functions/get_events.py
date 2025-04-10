from datetime import date
import datetime
import time
from flask import request, jsonify
from database import get_connection

def events(user_id):
	try:
		data = request.get_json()
		event_id = data.get("event_id")
		event_name = data.get("event_name")
		location = data.get("location")
		date = data.get("date")
		time = data.get("time")
		description = data.get("description")

		conn = get_connection()
		cursor = conn.cursor()

		rows = cursor.fetchall()

		cursor.execute
		(
			"SELECT event_name, location, date, time, description FROM events WHERE user_id = ?",
			(user_id,)
		)