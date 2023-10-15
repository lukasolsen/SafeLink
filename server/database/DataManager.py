import psycopg2
import uuid
import dotenv
import json

dotenv.load_dotenv()

databases = {
    "clients": "clients",
}

class PostgreSQLDataManager:
    def __init__(self, database=databases["clients"]):
        self.connection = self.connect_to_database(database)
        self.create_table()

    def connect_to_database(self, database):
        return psycopg2.connect(
            dbname=dotenv.dotenv_values().get("POSTGRES_DB"),
            user=dotenv.dotenv_values().get("POSTGRES_USER"),
            password=dotenv.dotenv_values().get("POSTGRES_PASSWORD"),
            host=dotenv.dotenv_values().get("POSTGRES_HOST"),
            port=dotenv.dotenv_values().get("POSTGRES_PORT")
        )

    def create_table(self):
        cursor = self.connection.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS client_data (
                client_id UUID PRIMARY KEY,
                data JSONB,
                status VARCHAR(50) DEFAULT 'online',
                socket_ip VARCHAR(50),
                created_at TIMESTAMP DEFAULT NOW()
            )
        ''')
        self.connection.commit()

    def insert_data(self, client_id, data, socket_ip):
        cursor = self.connection.cursor()
        cursor.execute('''
            INSERT INTO client_data (client_id, data, socket_ip) VALUES (%s, %s, %s)
        ''', (client_id, data, socket_ip))
        self.connection.commit()

    def get_data(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute('SELECT data FROM client_data WHERE client_id = %s', (client_id,))
        data = cursor.fetchone()
        return data[0] if data else None

    def update_data(self, client_id, data):
        cursor = self.connection.cursor()
        cursor.execute('''
            UPDATE client_data SET data = %s WHERE client_id = %s
        ''', (data, client_id))
        self.connection.commit()

    def delete_data(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute('DELETE FROM client_data WHERE client_id = %s', (client_id,))
        self.connection.commit()

    def get_all_data(self):
        cursor = self.connection.cursor()
        cursor.execute('SELECT data FROM client_data')
        data = cursor.fetchall()
        return data

    def edit_all_status(self, status):
        cursor = self.connection.cursor()
        cursor.execute('UPDATE client_data SET status = %s', (status,))
        self.connection.commit()

    def change_status(self, client_id, status):
        cursor = self.connection.cursor()
        cursor.execute('''
            UPDATE client_data SET status = %s WHERE client_id = %s
        ''', (status, client_id))
        self.connection.commit()

    def get_status(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute('SELECT status FROM client_data WHERE client_id = %s', (client_id,))
        status = cursor.fetchone()
        return status[0] if status else None

    def user_exists(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute('SELECT client_id FROM client_data WHERE client_id = %s', (client_id,))
        return cursor.fetchone() is not None

    def close_connection(self):
        self.connection.close()

    def get_socket_ip(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute('SELECT socket_ip FROM client_data WHERE client_id = %s', (client_id,))
        socket_ip = cursor.fetchone()
        return socket_ip[0] if socket_ip else None

    def get_clients(self):
        cursor = self.connection.cursor()
        cursor.execute('SELECT client_id, data, status, created_at FROM client_data')
        client_records = cursor.fetchall()
        print(client_records)
        client_data = []

        for record in client_records:
            client_id, data, status, created_at = record
            system_info = data["System Info"]

            # try to parse it into a JSON
            try:
                system_info = json.loads(system_info)
            except json.JSONDecodeError:
                system_info = {}

            client_info = {
                "id": client_id,
                "ipv4": system_info.get("IPv4"),
                "computer_name": system_info.get("ComputerName"),
                "status": status,
                "created_at": created_at
            }

            client_data.append(client_info)

        return client_data

    def get_client(self, client_id):
      cursor = self.connection.cursor()
      try:
        cursor.execute('SELECT client_id, data, status, created_at FROM client_data WHERE client_id = %s', (client_id,))
        client_record = cursor.fetchone()
        if client_record is None:
          return None

        client_id, data, status, created_at = client_record
        system_info = json.loads(data["System Info"])

        client_info = {
          "id": client_id,
          "ipv4": system_info.get("IPv4"),
          "computer_name": system_info.get("ComputerName"),
          "status": status,
          "created_at": created_at
        }

        return client_info
      except:
        return None

    def get_all_client_info(self, client_id):
        cursor = self.connection.cursor()
        cursor.execute('SELECT * FROM client_data WHERE client_id = %s', (client_id,))
        client_record = cursor.fetchone()
        if client_record is None:
            return None

        client_id, data, status, socket_ip, created_at = client_record
        return {
            "id": client_id,
            "data": data,
            "status": status,
            "socket_ip": socket_ip,
            "created_at": created_at
        }

    def _generate_client_id(self):
        return uuid.uuid4().hex

    # Additional function to retrieve all client IDs
    def get_all_client_ids(self):
        cursor = self.connection.cursor()
        cursor.execute('SELECT client_id FROM client_data')
        client_ids = [row[0] for row in cursor.fetchall()]
        return client_ids
