import subprocess
import json


class Language:
    def __init__(self, name, path):
        self.name = name
        self.path = path

    def execute(self, command):
        raise NotImplementedError("Subclasses must implement this method")


class PowerShell(Language):
    def __init__(self):
        super().__init__("PowerShell", "powershell.exe")

    def execute(self, command):
        try:
            script = command
            process = subprocess.Popen(
                [self.path, "-NoProfile", "-ExecutionPolicy",
                    "Bypass", "-command", script],

                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                stdin=subprocess.PIPE,
                shell=True,
                text=True
            )

            out, err = process.communicate()

            if process.returncode == 0:
                result = out.strip()
                error = None
            else:
                result = None
                error = err.strip()

            response = {
                "result": result,
                "error": error
            }

            return response
        except Exception as e:
            return {"error": str(e)}


class Terminal:
    def __init__(self):
        self.languages = {}

    def add_language(self, language):
        if language.name not in self.languages:
            self.languages[language.name] = language

    def remove_language(self, language_name):
        if language_name in self.languages:
            del self.languages[language_name]

    def execute(self, language_name, command):
        if language_name not in self.languages:
            return {"error": f"Language '{language_name}' is not supported."}

        lang = self.languages[language_name]

        return lang.execute(command)
