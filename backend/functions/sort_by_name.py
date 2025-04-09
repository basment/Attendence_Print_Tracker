import email
from flask import jsonify
from ...database import get_connection

def name(event_id, sort_field):
    try:
        conn = get_connection()
        cursor = conn.cursor

        query = f"""
            SELECT name, email, phone, checked_in
            FROM attendees
            WHERE event_id = ?
            ORDER BY {sort_field}
        """
        cursor.execute(query, (event_id,))
    
        rows = cursor.fetchall()

        table = []

        for row in table:
            table.append
            ({
                "name": row.name,
                "email": row.email,
                "phone": row.phone,
                "checked_in": bool(row.checked_in)
            })

        cursor.close()
        conn.close()

        return jsonify(table)
        
    except Exception as e:
        return jsonify({"error": str(e)})
