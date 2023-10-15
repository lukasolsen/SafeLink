import sqlite3
import os


class User:
    def __init__(self, id, username, email, password, settings):
        self.id = id
        self.username = username
        self.email = email
        self.password = password
        self.settings = settings
# Should be in server/data/users.db


if not os.path.exists("data"):
    os.mkdir("data")

if (not os.path.exists("data/users.db")):
    open("data/users.db", "w").close()


def connect():
    """Connect to the database"""
    con = sqlite3.connect('data/users.db')
    return con, con.cursor()

# Some information about the database:
# Table: clients
# Columns: id, name, ip, status, computer_name, os, architecture, username, country, city, latitude, longitude, isp, timezone, organization, postal, connection_type, region, region_name, screen_share_source


def check():
    con, cur = connect()
    """Check if the database has the required tables and if it even exists"""
    try:
        cur.execute("SELECT * FROM users")
        return True
    except sqlite3.OperationalError:
        return False


def make_users():
    con, cur = connect()
    """Create the clients table with an auto-incrementing primary key"""
    cur.execute("""
        CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE,
            EMAIL TEXT UNIQUE,
            PASSWORD TEXT,
            SETTINGS TEXT
        )
    """)
    con.commit()


if not check():

    make_users()


def add_user(username, email, password, settings):
    con, cur = connect()
    print("Adding client to database")
    cur.execute("INSERT INTO `users` (username, email, password, settings) VALUES (?, ?, ?, ?)",
                (username, email, password, settings))
    con.commit()


def get_users():
    con, cur = connect()
    cur.execute("SELECT * FROM users")
    client_records = cur.fetchall()

    users = []
    for record in client_records:
        user = User(*record)
        users.append(user)

    return users


def get_user(id):
    con, cur = connect()
    cur.execute("SELECT * FROM users WHERE id=?", (id,))
    client_records = cur.fetchall()

    users = []
    for record in client_records:
        client = User(*record)
        users.append(client)

    return users


def get_user_by_username(username):
    con, cur = connect()
    cur.execute("SELECT * FROM users WHERE username=?", (username,))
    client_records = cur.fetchall()

    users = []
    for record in client_records:
        print(record)
        client = User(*record)
        users.append(client)

    return users


def edit_users(key, value):
    con, cur = connect()
    # Find the key we want to edit, then edit it
    # Do this for all of the clients
    cur.execute("SELECT * FROM users")
    client_records = cur.fetchall()

    clients = []
    for record in client_records:
        client = User(*record)
        clients.append(client)

    for client in clients:
        cur.execute(
            f"UPDATE users SET {key}=? WHERE id=?", (value, client.id))
        con.commit()


def edit_user(client_id, key, value):
    con, cur = connect()
    # Find the key we want to edit, then edit it
    # Do this for all of the clients
    cur.execute("SELECT * FROM users WHERE id=?", (client_id,))
    client_records = cur.fetchall()

    clients = []
    for record in client_records:
        client = User(*record)
        clients.append(client)

    for client in clients:
        cur.execute(
            f"UPDATE users SET {key}=? WHERE id=?", (value, client.id))
        con.commit()
