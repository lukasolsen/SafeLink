import winreg as _winreg
from modules.browsers.chrome import *


def handle_browser_information():
    browser_information = get_browsers()

    for browser_name in browser_information.keys():
        if (browser_name == "Google Chrome" or browser_name == "Chrome"):
          pre_chrome()
          browser_information[browser_name] = get_chrome_information()

    return browser_information

def get_browsers():
    browser_information = {}

    try:
        # Get all the browsers installed on the system
        with _winreg.OpenKey(_winreg.HKEY_LOCAL_MACHINE, r'SOFTWARE\Clients\StartMenuInternet') as key:
            for i in range(0, _winreg.QueryInfoKey(key)[0]):
                browser_name = _winreg.EnumKey(key, i)
                browser_path = _winreg.QueryValue(
                    key, browser_name + r'\shell\open\command')
                browser_information[browser_name] = {
                    "path": browser_path
                }
    except Exception as e:
        print("Error getting browsers:", str(e))

    return browser_information
