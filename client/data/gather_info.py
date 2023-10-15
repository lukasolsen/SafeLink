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
  for device in win32com.client.Dispatch("WbemScripting.SWbemLocator").ConnectServer(".","root\cimv2").ExecQuery("SELECT * FROM Win32_USBHub"):
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

def get_system_information():
  DOS_OS_BITS = 0x00000001
  return json.dumps({
      "IPv4": get_ip(),
      "ComputerName": os.environ["COMPUTERNAME"],
      "Username": getpass.getuser(),
      "Hardware": {
        "CPU": {
          "Name": platform.processor(),
          "Cores": psutil.cpu_count(),
          "Usage": str(psutil.cpu_percent()) + "%"
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
      "Battery": {
        "Percent": psutil.sensors_battery().percent,
        "Power Plugged": psutil.sensors_battery().power_plugged,
        "Seconds Left": psutil.sensors_battery().secsleft,
      },
      "Privileges": ctypes.windll.shell32.IsUserAnAdmin(),
      "Devices": {
          "USB Devices": get_usb_devices(),
      }
    }
  )

def get_network_information():
  return json.dumps({
    "Network Adapter": {
      "Name": "Ethernet",
      "Status": "Connected",
      "Speed": "1 Gbps",
      "Type": "Wired"
    },
    "Network Speed": "100 Mbps",
    "Network Type": "Wi-Fi",
    "Network Status": "Connected",
    "Network Usage": {
      "Upload": "1.2 MB/s",
      "Download": "5.3 MB/s"
    },
    "Network Connections": [
      {
        "IP": "",
        "Port": 80,
        "Protocol": "HTTP"
      },
    ]
  })
