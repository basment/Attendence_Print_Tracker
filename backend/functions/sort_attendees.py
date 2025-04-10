from flask import jsonify
from database import get_connection

def export_attendees(event_id, sort_field):

    try:
        conn = get_connection()
        cursor = conn.cursor()

        query = f"""
            SELECT name, email, phone, checked_in
            FROM attendees
            WHERE event_id = ?
            ORDER BY {sort_field}
        """
        cursor.execute(query, (event_id,))
        rows = cursor.fetchall()

        if not rows:
            return jsonify({"message": "No attendees found."})

        attendees = []
        for row in rows:
            attendees.append({
                "name": row.name,
                "email": row.email,
                "phone": row.phone,
                "checked_in": bool(row.checked_in)
            })

        cursor.close()
        conn.close()

        return jsonify(attendees)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
