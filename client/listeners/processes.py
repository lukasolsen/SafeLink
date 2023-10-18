import psutil
import json
import socket
from communication.id import SimpleVariableStorage
from datetime import datetime

id = SimpleVariableStorage("client_id.json").get_client_id()

def get_processes():
    processes = []
    for process in psutil.process_iter(attrs=['pid', 'name', 'username']):
        process_info = process.info
        processes.append(process_info)
    return processes

def process_listener(socket):
    previous_processes = get_processes()
    while True:
        try:
            current_processes = get_processes()
            # Check if the previous processes are the same as the current processes
            if previous_processes != current_processes:
                diff_processes = get_process_diff(previous_processes, current_processes)
                if diff_processes:
                    print(id)
                    # now make a message variable
                    # make the message be something like: "Process started: process_name" or "Process terminated: process_name"
                    # then send the message to the server
                    message = f"Process {diff_processes[0]['status']}: {diff_processes[0]['process']['name']}"

                    data = {"client_id": id, "type": "information", "part": "process", "data": diff_processes, "message": message, "timestamp": datetime.now().strftime("%d/%m/%Y %H:%M:%S")}
                    socket.send(json.dumps(data).encode())
                previous_processes = current_processes
        except Exception as e:
            print("Error handling process:", str(e))
            break

def get_process_diff(previous_processes, current_processes):
    process_diff = []
    for process in current_processes:
        if process not in previous_processes:
            process_diff.append({"status": "started", "process": process})
    for process in previous_processes:
        if process not in current_processes:
            process_diff.append({"status": "terminated", "process": process})
    return process_diff