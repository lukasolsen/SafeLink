import os
import psutil
import getpass
import platform
import socket
import json
import ctypes
import sys
import win32com.client

def get_ip():
  addresses = {}
  ipv4 = None
  for interface in psutil.net_if_addrs().keys():
      addresses[interface] = None
      for address in psutil.net_if_addrs()[interface]:
          if address.family == socket.AF_INET:
              addresses[interface] = address.address
              if interface == "Ethernet" or interface == "WiFi":
                  ipv4 = address.address
  return ipv4

def get_usb_devices():
  devices = []
  devicesCom = win32com.client.Dispatch("WbemScripting.SWbemLocator").ConnectServer(".","root\cimv2").ExecQuery("SELECT * FROM Win32_USBHub")
  if len(devicesCom) == 0:
    return []
  for device in devicesCom:
    devices.append({
      "Name": device.Name,
      "Description": device.Description,
      "DeviceID": device.DeviceID,
      "Status": device.Status,
      "PNPDeviceID": device.PNPDeviceID,
      "Caption": device.Caption,
      "StatusInfo": device.StatusInfo,
    })
  return devices

def get_bluetooth_devices():
    devices = []
    devicesCom = win32com.client.Dispatch("WbemScripting.SWbemLocator").ConnectServer(".","root\cimv2").ExecQuery("SELECT * FROM Win32_PnPEntity WHERE ClassGuid = '{e0cbf06c-cd8b-4647-bb8a-263b43f0f974}'")
    if len(devicesCom) == 0:
      return []
    for device in devicesCom:
      devices.append({
        "Name": device.Name,
        "Description": device.Description,
        "DeviceID": device.DeviceID,
        "Status": device.Status,
        "PNPDeviceID": device.PNPDeviceID,
        "Caption": device.Caption,
        "StatusInfo": device.StatusInfo,
      })
    return devices

def get_pci_devices():
  devices = []
  devicesCom = win32com.client.Dispatch("WbemScripting.SWbemLocator").ConnectServer(".","root\cimv2").ExecQuery("SELECT * FROM Win32_PnPEntity WHERE ClassGuid = '{4d36e968-e325-11ce-bfc1-08002be10318}'")
  if len(devicesCom) == 0:
    return []
  for device in devicesCom:
    devices.append({
      "Name": device.Name,
      "Description": device.Description,
      "DeviceID": device.DeviceID,
      "Status": device.Status,
      "PNPDeviceID": device.PNPDeviceID,
      "Caption": device.Caption,
      "StatusInfo": device.StatusInfo,
    })
  return devices

def get_audio_devices():
  devices = []
  devicesCom = win32com.client.Dispatch("WbemScripting.SWbemLocator").ConnectServer(".","root\cimv2").ExecQuery("SELECT * FROM Win32_SoundDevice")
  if len(devicesCom) == 0:
    return []
  for device in devicesCom:
    devices.append({
      "Name": device.Name,
      "Description": device.Description,
      "DeviceID": device.DeviceID,
      "Status": device.Status,
      "PNPDeviceID": device.PNPDeviceID,
      "Caption": device.Caption,
      "StatusInfo": device.StatusInfo,
    })
  return devices

def get_battery_information():
  # check if percent exists if not then just say None
  if (psutil.sensors_battery() == None):
    return json.dumps({
      "Percent": "None",
      "Power Plugged": "None",
      "Seconds Left": "None",
    })
  percent = psutil.sensors_battery().percent or None
  power_plugged = psutil.sensors_battery().power_plugged or None
  secsleft = psutil.sensors_battery().secsleft or None
  return json.dumps({
    "Percent": percent,
    "Power Plugged": power_plugged,
    "Seconds Left": secsleft,
  })

def get_system_information():
  return json.dumps({
      "IPv4": get_ip(),
      "ComputerName": os.environ["COMPUTERNAME"],
      "Username": getpass.getuser(),
      "Hardware": {
        "CPU": {
          "Name": platform.processor(),
          "Cores": psutil.cpu_count(),
          "Usage": str(psutil.cpu_percent()) + "%",
          "Speed": str(round(psutil.cpu_freq().current / 1000.0, 2)) + " GHz",
          "Max Speed": str(round(psutil.cpu_freq().max / 1000.0, 2)) + " GHz",
          "Min Speed": str(round(psutil.cpu_freq().min / 1000.0, 2)) + " GHz",
          
          "Virtual Cores": psutil.cpu_count(logical=True),
          "Physical Cores": psutil.cpu_count(logical=False),
          
          "Times": {
            "User": psutil.cpu_times().user,
            "System": psutil.cpu_times().system,
            "Idle": psutil.cpu_times().idle,
            "Interrupt": psutil.cpu_times().interrupt,
            "DPC": psutil.cpu_times().dpc,
          },
        },
        "RAM": {
          "Total": str(round(psutil.virtual_memory().total / (1024.0 ** 3), 2)),
          "Used": str(round(psutil.virtual_memory().used / (1024.0 ** 3), 2)),
          "Free": str(round(psutil.virtual_memory().free / (1024.0 ** 3), 2)),
          "Percent": str(psutil.virtual_memory().percent) + "%",
          "Speed": str(round(psutil.virtual_memory().total / (1024.0 ** 3), 2)) + " MHz",
          
          "Swap Total": str(round(psutil.swap_memory().total / (1024.0 ** 3), 2)),
          "Swap Used": str(round(psutil.swap_memory().used / (1024.0 ** 3), 2)),
          "Swap Free": str(round(psutil.swap_memory().free / (1024.0 ** 3), 2)),
          "Swap Percent": str(psutil.swap_memory().percent) + "%",
        },
        "Disk": {
          "Total": str(round(psutil.disk_usage("/").total / (1024.0 ** 3), 2)),
          "Used": str(round(psutil.disk_usage("/").used / (1024.0 ** 3), 2)),
          "Free": str(round(psutil.disk_usage("/").free / (1024.0 ** 3), 2)),
          "Percent": str(psutil.disk_usage("/").percent) + "%",

          "Read Count": psutil.disk_io_counters().read_count,
          "Write Count": psutil.disk_io_counters().write_count,
          "Read Bytes": str(round(psutil.disk_io_counters().read_bytes / (1024.0 ** 3), 2)),
          "Write Bytes": str(round(psutil.disk_io_counters().write_bytes / (1024.0 ** 3), 2)),

          "Read Time": str(round(psutil.disk_io_counters().read_time / (1024.0 ** 3), 2)),
          "Write Time": str(round(psutil.disk_io_counters().write_time / (1024.0 ** 3), 2)),
      },
        "System": {
          "OS": platform.system(),
          "OS Version": platform.version(),
          "OS Release": platform.release(),
          "OS Architecture": platform.architecture()[0],
          "OS Machine": platform.machine(),
          "OS Platform": platform.platform(),


          "Boot Time": psutil.boot_time(),
          "Idle Time": psutil.cpu_times().idle,
        },
      },
      "Battery": get_battery_information(),
      "Privileges": ctypes.windll.shell32.IsUserAnAdmin(),
      "Devices": {
          "USB Devices": get_usb_devices(),
          "Audio Devices": get_audio_devices(),
          "Bluetooth Devices": get_bluetooth_devices(),
          #"PCI Devices": get_pci_devices(),
      }
    }
  )

def get_network_interfaces():
  interfaces = []
  for interface in psutil.net_if_addrs().keys():
      addresses = []
      for address in psutil.net_if_addrs()[interface]:
          if address.family == socket.AF_INET:
              addresses.append(address.address)
      interfaces.append({
        "Name": interface,
        "Addresses": addresses,
      })
  return interfaces

def get_network_configurations():
  internet_type = None
  if "Ethernet" in psutil.net_if_addrs():
    internet_type = "Ethernet"
  elif "WiFi" in psutil.net_if_addrs():
    internet_type = "WiFi"
  else:
    internet_type = "Ethernet"
  print(psutil.net_if_addrs()[internet_type])

  return json.dumps({
    "Internet Type": internet_type,
    "IP Address": psutil.net_if_addrs()[internet_type][0].address,
    "Netmask": psutil.net_if_addrs()[internet_type][0].netmask,
    "Broadcast IP": psutil.net_if_addrs()[internet_type][0].broadcast,
    "MAC Address": psutil.net_if_addrs()[internet_type][0].address,
  })

def get_network_information():
  return json.dumps({
    "Network Interfaces": get_network_interfaces(),
    "Network Connections": psutil.net_connections(),
    "Network Stats": psutil.net_io_counters(),
    "Network Configuration": get_network_configurations(),

    "Devices Connected": psutil.net_if_stats(),
  })