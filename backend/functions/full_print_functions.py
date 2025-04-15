from flask import jsonify
from database import get_connection
import win32print
import win32ui

#Function to get ettendee info
def get_attendee_info(attendee_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name, company, job FROM attendees WHERE attendee_id = ?", (attendee_id,))
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

import win32print
import win32ui

def print_nametag(name, company, job):
    printer_name = win32print.GetDefaultPrinter()
    hprinter = win32print.OpenPrinter(printer_name)
    hdc = win32ui.CreateDC()  
    hdc.CreatePrinterDC(printer_name)

    hdc.StartDoc("Nametag")
    hdc.StartPage()

    font = win32ui.CreateFont({
        "name": "Arial",
        "height": 48,  
        "weight": 700
    })
    hdc.SelectObject(font)
    hdc.TextOut(100, 100, name)

    font2 = win32ui.CreateFont({
    "name": "Arial",
    "height": 36,
    "weight": 700  # Make this match the earlier font
})
    if font2:
        hdc.SelectObject(font2)
    else:
        raise ValueError("Font2 could not be created")

    hdc.TextOut(100, 200, company)
    hdc.TextOut(100, 300, job)

    hdc.EndPage()
    hdc.EndDoc()
    hdc.DeleteDC()


#Final function to generate and print nametag
def generate_and_print_nametag(attendee_id):
    row = get_attendee_info(attendee_id)
    if row:
        name, company, job = row


        name = str(name) if name is not None else ""
        company = str(company) if company is not None else ""
        job = str(job) if job is not None else ""

        print_nametag(name, company, job)
        return {"message": "Nametag printed!"}
    else:
        return {"error": "Attendee not found"}


