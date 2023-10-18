import socket
from communication.id import SimpleVariableStorage
import json
from data.gather_info import get_system_information, get_network_information
import sys

# Listeners
from listeners.processes import process_listener

# Define a Socket Class, it will be used for handling communications between the client and server.
class SocketClient:
  def __init__(self, host: str, port: int, realtimehost: str, realtimeport: int):
    self.host = host
    self.port = port

    self.realtimehost = realtimehost
    self.realtimeport = realtimeport

    self.connected = False

    # Connect to the server
    self.connect()

  def receive_output(self, size=1024):
    try:
      output = self.client.recv(size).decode()
      print(output)
      return output
    except Exception as e:
      print(f"Socket Client -> Error receiving output: {str(e)}")

  def send_command(self, command: dict):
    try:
      commandAsString = json.dumps(command)
      self.client.send(commandAsString.encode())
    except Exception as e:
      print(f"Socket Client -> Error sending command: {str(e)}")

  def real_time_information(self, command: dict):
    try:
      commandAsString = json.dumps(command)
      self.realtimeclient.send(commandAsString.encode())
    except Exception as e:
      print(f"Socket Client -> Error sending command: {str(e)}")

  def connect(self):
    try:
      self.client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      print("Port", self.port)
      print("Host", self.host)
      self.client.connect((self.host, self.port))
      print(f"Socket Client -> Connected to {self.host}:{self.port}")
      self.connected = True
      self._handshake()
    except Exception as e:
      print(f"Socket Client -> Error connecting to {self.host}:{self.port}: {str(e)}")
      self.connected = False
      return

  def real_time_connect(self):
    try:
      # use a new thread for the real time connection
      self.realtimeclient = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      #self.client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      self.realtimeclient.connect((self.realtimehost, self.realtimeport))
      print(f"Socket Client -> Connected to {self.realtimehost}:{self.realtimeport}")
    
      # Start the real time listener
      process_listener(self.realtimeclient)
    except Exception as e:
      print(f"Socket Client -> Error connecting to {self.realtimehost}:{self.realtimeport}: {str(e)}")
      return

  def _handshake(self):
    try:
      print("Socket Client -> Waiting for verification message")
      self.receive_output()
      print("Socket Client -> Received verification message")
      # What we get is "verify", so we send back {type: "verify", ID: "client_id"}
      client_id = SimpleVariableStorage.get_instance('client_id.json').get_client_id()
      command = {"type": 'verify', "ID": client_id}
      print("Socket Client -> Sending verification message")
      self.send_command(command)
      print("Socket Client -> Sent verification message")

      # Then we wait for the server to send us a verification message
      verification = json.loads(self.receive_output())
      print("Socket Client -> Received verification message")
      if (verification["ID"]):
        # If we get a client ID, we store it, that means that our ID was faulty, and we need to update it
        SimpleVariableStorage.get_instance('client_id.json').save_client_id(verification["ID"])
        client_id = verification["ID"]
      
      receive_data = True
      while receive_data:
        data = self.receive_output()
        print("Data -> ", data)
        data = json.loads(data)

        # Check if the data includes a key "ended" if so then stop it, if not then continue


        if ("ended" in data and data["ended"] == True):
          print("Socket Client -> Received end message")
          receive_data = False
          break
        else:
          self.gather_info(data)
          # Continue the loop
          continue

    except Exception as e:
      print(f"Socket Client -> Error during handshake: {str(e)}")
      self.connected = False
  def isConnected(self):
    return self.isConnected
  
  def gather_info(self, mess):
    # mess is a JSON object, it contains type: information, part: "system info" or something like that.
    if (mess["type"] == "information"):
      # Check the part, if part does not exist just send a empty json object back.
      if (mess["part"] == "system_info"):
        print(get_system_information())
        # Send system info back.
        self.send_command({"type": "information", "part": "system info", "data": get_system_information()})
      elif (mess["part"] == "network_info"):
        self.send_command({"type": "information", "part": "network info", "data": get_network_information()})
      else:
        self.send_command({"type": "information", "part": mess["part"], "data": {}})