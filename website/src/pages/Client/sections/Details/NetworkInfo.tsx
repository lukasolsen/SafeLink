import React, { useState } from "react";
import { FiServer, FiMinus, FiPlus } from "react-icons/fi";

const NetworkInfo: React.FC = () => {
  const [minimized, setMinimized] = useState(false);

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  return (
    <div className={`dark:bg-dark-bg-secondary p-4 rounded-lg shadow-md mb-8`}>
      <h2 className="text-lg text-white mb-4 flex items-center">
        <FiServer className="mr-2 text-sky-400" /> Network Info
        <button className="ml-auto focus:outline-none" onClick={toggleMinimize}>
          {minimized ? <FiPlus /> : <FiMinus />}
        </button>
      </h2>

      <div
        className={`transition-all duration-300 ${
          minimized ? "hidden" : "auto"
        }`}
      >
        {/* Network Configurations */}
        <div className={`mb-6`}>
          <h3 className="text-base text-sky-400">Network Configurations</h3>
          {/* Display detailed network configuration information */}
          <p className="text-white">Network Type: Wi-Fi</p>
          <p className="text-white">SSID: YourNetworkName</p>
          <p className="text-white">Security: WPA2-Personal</p>
          <p className="text-white">Signal Strength: Excellent</p>
        </div>

        {/* IP Addresses */}
        <div className="mb-6">
          <h3 className="text-base text-sky-400">IP Addresses</h3>
          {/* Display IP addresses and network details */}
          <p className="text-white">IP Address: 192.168.1.100</p>
          <p className="text-white">Subnet Mask: 255.255.255.0</p>
          <p className="text-white">Gateway: 192.168.1.1</p>
          <p className="text-white">DNS Server: 8.8.8.8</p>
        </div>

        {/* Connected Devices */}
        <div>
          <h3 className="text-base text-sky-400">Connected Devices</h3>
          {/* Display a list of connected devices */}
          <ul className="list-disc list-inside text-white">
            <li>Device 1: 192.168.1.101</li>
            <li>Device 2: 192.168.1.102</li>
            <li>Device 3: 192.168.1.103</li>
            <li>Device 4: 192.168.1.104</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NetworkInfo;
