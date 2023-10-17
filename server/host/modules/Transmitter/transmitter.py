import socket
import threading
from host.components.terminalStyles import *

class TransmitServer:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.clients = {}

        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.bind((self.host, self.port))

    def start(self):
        self.socket.listen(5)
        #print("[*] Waiting for clients...")
        header(name="Transmitter", message="Waiting for clients...")

        while True:
            try:
                client, addr = self.socket.accept()
                self.clients[addr[0]] = client

                #print(f"[*] Connection established with {addr[0]}")
                header(name="Transmitter", message=f"Connection established with {addr[0]}")

                # Start the receiving process for the client.
                client_handler = TransmitHandler(client)
                client_handler.start()

            except Exception as e:
                self.clients.pop(addr[0])

class TransmitHandler(threading.Thread):
    def __init__(self, socket):
        super().__init__()
        self.socket = socket

    def run(self):
        #Wprint(f"[*] Handling client {self.socket.getpeername()}")
        header(name="Transmitter", message=f"Handling client {self.socket.getpeername()}")

        while True:
            data = self.socket.recv(1024)
            if not data:
                break  # Connection closed

            decoded_data = data.decode()
            self.data_manager(decoded_data)

        self.socket.close()
        #print(f"[*] Connection closed with {self.socket.getpeername()}")
        header(name="Transmitter", message=f"Connection closed with {self.socket.getpeername()}")

    def data_manager(self, data):
        # Handle the data here.
        if data:
            print(data)