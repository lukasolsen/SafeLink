import sqlite3
import os
import json
import psutil

profile_path = os.path.expanduser(
    "~\\AppData\\Local\\Google\\Chrome\\User Data\\Default")

# check if chrome is open
# if it is, close it
# then run the following functions


def pre_chrome():
    for proc in psutil.process_iter():
        if proc.name() == "chrome.exe":
            proc.kill()


def get_chrome_downloads():
    try:
      history_db = os.path.join(profile_path, "History")

      connection = sqlite3.connect(history_db)
      cursor = connection.cursor()

      cursor.execute("SELECT * FROM downloads")
      downloads = cursor.fetchall()

      row_names = [description[0] for description in cursor.description]

      connection.close()
      return downloads, row_names
    except Exception as e:
      print("Error getting chrome downloads:", str(e))
      return []


def get_chrome_history():
    try:
      history_db = os.path.join(profile_path, "History")

      connection = sqlite3.connect(history_db)
      cursor = connection.cursor()

      cursor.execute("SELECT * FROM urls")
      history = cursor.fetchall()

      row_names = [description[0] for description in cursor.description]

      connection.close()
      return str(history), row_names
    except Exception as e:
      print("Error getting chrome history:", str(e))
      return []


def get_chrome_keywords():
    try:
      
      history_db = os.path.join(profile_path, "History")

      connection = sqlite3.connect(history_db)
      cursor = connection.cursor()

      cursor.execute("SELECT * FROM keyword_search_terms")
      keywords = cursor.fetchall()

      row_names = [description[0] for description in cursor.description]

      connection.close()
      return str(keywords), row_names
    except Exception as e:
      print("Error getting chrome keywords:", str(e))
      return []


def get_chrome_shortcuts():
    try:
      shortcuts_db = os.path.join(profile_path, "Shortcuts")
      connection = sqlite3.connect(shortcuts_db)
      cursor = connection.cursor()

      cursor.execute("SELECT * FROM omni_box_shortcuts")
      shortcuts = cursor.fetchall()

      row_names = [description[0] for description in cursor.description]

      connection.close()
      return str(shortcuts), row_names
    except Exception as e:
      print("Error getting chrome shortcuts:", str(e))
      return []


def get_chrome_autofill():
    try:
      autofill_db = os.path.join(profile_path, "Web Data")
      connection = sqlite3.connect(autofill_db)
      cursor = connection.cursor()

      cursor.execute("SELECT * FROM autofill")
      autofill = cursor.fetchall()

      row_names = [description[0] for description in cursor.description]

      connection.close()
      return str(autofill), row_names
    except Exception as e:
      print("Error getting chrome autofill:", str(e))
      return []


def get_chrome_cookies():
    try:
      cookies_db = os.path.join(profile_path, "Cookies")
      connection = sqlite3.connect(cookies_db)
      cursor = connection.cursor()

      cursor.execute("SELECT * FROM cookies")
      cookies = cursor.fetchall()

      row_names = [description[0] for description in cursor.description]

      connection.close()
      return str(cookies), row_names
    except Exception as e:
      print("Error getting chrome cookies:", str(e))
      return []


def get_chrome_login_data():
    try:
      login_data_db = os.path.join(profile_path, "Login Data")
      connection = sqlite3.connect(login_data_db)
      cursor = connection.cursor()

      cursor.execute("SELECT * FROM logins")
      logins = cursor.fetchall()

      row_names = [description[0] for description in cursor.description]

      connection.close()
      return str(logins), row_names
    except Exception as e:
      print("Error getting chrome login data:", str(e))
      return []


def get_chrome_preferences():
    try: 
      preferences_db = os.path.join(profile_path, "Preferences")
      with open(preferences_db, "r") as f:
          preferences = f.read()
      return str(preferences)
    except Exception as e:
      print("Error getting chrome preferences:", str(e))
      return []


def get_chrome_secure_preferences():
    try:
      secure_preferences_db = os.path.join(profile_path, "Secure Preferences")
      with open(secure_preferences_db, "r") as f:
          secure_preferences = f.read()
      return str(secure_preferences)
    except Exception as e:
      print("Error getting chrome secure preferences:", str(e))
      return []


def get_chrome_saved_addresses():
    try:
      saved_addresses_db = os.path.join(profile_path, "Web Data")
      connection = sqlite3.connect(saved_addresses_db)
      cursor = connection.cursor()

      cursor.execute("SELECT * FROM server_addresses")
      saved_addresses = cursor.fetchall()

      row_names = [description[0] for description in cursor.description]

      connection.close()
      return str(saved_addresses), row_names
    except Exception as e:
      print("Error getting chrome saved addresses:", str(e))
      return []


def get_chrome_bookmarks():
    try:
      # Bookmarks is a JSON file, with just a non extension name
      bookmarks_db = os.path.join(profile_path, "Bookmarks")
      with open(bookmarks_db, "r") as f:
          bookmarks = f.read()
      return str(bookmarks)
    except Exception as e:
      print("Error getting chrome bookmarks:", str(e))
      return []


def get_chrome_topsites():
    try:
        topsites_db = os.path.join(profile_path, "Top Sites")
        connection = sqlite3.connect(topsites_db)
        cursor = connection.cursor()

        cursor.execute("SELECT * FROM top_sites")
        topsites = cursor.fetchall()

        # Get the column names (row names)
        row_names = [description[0] for description in cursor.description]

        connection.close()
        return str(topsites), row_names
    except Exception as e:
        print("Error getting chrome topsites:", str(e))
        return [], []



def get_chrome_network_action_predicter():
    try:
      network_action_predicter_db = os.path.join(
          profile_path, "Network Action Predictor")
      connection = sqlite3.connect(network_action_predicter_db)
      cursor = connection.cursor()

      cursor.execute("SELECT * FROM network_action_predictor")
      network_action_predictor = cursor.fetchall()

      row_names = [description[0] for description in cursor.description]

      connection.close()
      return str(network_action_predictor), row_names
    except Exception as e:
        print("Error getting chrome network action predictor:", str(e))
        return []


def get_action_network_action_predictor_redirect():
    try:
      network_action_predictor_redirect_db = os.path.join(
          profile_path, "Network Action Predictor")
      connection = sqlite3.connect(network_action_predictor_redirect_db)
      cursor = connection.cursor()

      cursor.execute("SELECT * FROM resource_prefetch_predictor_host_redirect")
      network_action_predictor_redirect = cursor.fetchall()

      row_names = [description[0] for description in cursor.description]

      connection.close()
      return str(network_action_predictor_redirect), row_names
    except Exception as e:
        print("Error getting chrome network action predictor redirect:", str(e))
        return []


def get_chrome_favicons():
    try: 
      favicons_db = os.path.join(profile_path, "Favicons")
      connection = sqlite3.connect(favicons_db)
      cursor = connection.cursor()

      cursor.execute("SELECT * FROM favicons")
      favicons = cursor.fetchall()

      row_names = [description[0] for description in cursor.description]

      connection.close()
      return str(favicons), row_names
    except Exception as e:
        print("Error getting chrome favicons:", str(e))
        return []

def get_chrome_version():
    version_db = os.path.join(profile_path, "Local State")
    with open(version_db, "r") as f:
        version = f.read()
    return version

def get_chrome_information():
    # Add code to retrieve Chrome information here
    return {
        "history": get_chrome_history(),
        #"downloads": get_chrome_downloads(),
        #"keywords": get_chrome_keywords(),
        #"shortcuts": get_chrome_shortcuts(),
        #"cookies": get_chrome_cookies(),
        #"autofill": get_chrome_autofill(),
        #"bookmarks": get_chrome_bookmarks(),
        #"top_sites": get_chrome_topsites(),
        #"favicons": get_chrome_favicons()
    }