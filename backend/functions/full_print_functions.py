from flask import jsonify
from database import get_connection
import win32print
import win32ui

#Function to get ettendee info
def get_attendee_info(attendee_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name, company, job_position FROM attendees WHERE attendee_id = ?", (attendee_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return row

#Function to format the nametag
def format_nametag(name, company, job):
    return f"""
+--------------------------+
|                          |
|  {name.center(24)}  |
|  {job.center(24)}  |
|  {company.center(24)}  |
|                          |
+--------------------------+
"""

#Function for printing the nametag
def print_nametag(text):
    printer_name = win32print.GetDefaultPrinter()
    hprinter = win32print.OpenPrinter(printer_name)
    hdc = win32print.CreateDC("WINSPOOL", printer_name, None)
    hdc.StartDoc("Nametag")
    hdc.StartPage()

    font = win32ui.CreateFont({
        "name": "Arial",
        "height": 24,
        "weight": 700
    })
    hdc.SelectObject(font)
    hdc.TextOut(100, 100, text)

    hdc.EndPage()
    hdc.EndDoc()
    hdc.DeleteDC()

#Final function to generate and print nametag
def generate_and_print_nametag(attendee_id):
    row = get_attendee_info(attendee_id)
    if row:
        name, company, job = row
        tag = format_nametag(name, company, job)
        print_nametag(tag)
        return {"message": "Nametag printed!"}
    else:
        return {"error": "Attendee not found"}

