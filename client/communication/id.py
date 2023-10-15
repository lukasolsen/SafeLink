import os
import json

class SimpleVariableStorage:
    instance = None

    def __init__(self, variable_file_path):
        if not SimpleVariableStorage.instance:
            SimpleVariableStorage.instance = self
        self.variable_file_path = variable_file_path
        self.client_id = None

    @classmethod
    def get_instance(cls, variable_file_path):
        if not cls.instance:
            cls.instance = cls(variable_file_path)
        return cls.instance

    def save_client_id(self, client_id):
        self.client_id = client_id
        data = {"client_id": client_id}
        with open(self.variable_file_path, 'w') as file:
            json.dump(data, file)

    def get_client_id(self):
        if not self.client_id:
            if os.path.exists(self.variable_file_path):
                with open(self.variable_file_path, 'r') as file:
                    data = json.load(file)
                    self.client_id = data.get("client_id")
        return self.client_id
