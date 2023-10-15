import React, { useState } from "react";
import { FiInfo, FiServer, FiMinus, FiPlus } from "react-icons/fi";

const SystemInfo: React.FC = () => {
  const [minimized, setMinimized] = useState(false);

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  return (
    <div className={`dark:bg-dark-bg-secondary p-4 rounded-lg shadow-md mb-8`}>
      <h2 className="text-lg text-white mb-4 flex items-center">
        <FiServer className="mr-2 text-sky-400" /> System Info
        <button className="ml-auto focus:outline-none" onClick={toggleMinimize}>
          {minimized ? <FiPlus /> : <FiMinus />}
        </button>
      </h2>

      <div
        className={`transition-all duration-300 ${
          minimized ? "hidden" : "auto"
        }`}
      >
        {/* System Hardware Info */}
        <div className={`mb-6`}>
          <h3 className="text-base text-sky-400">Hardware Information</h3>
          {/* Display detailed hardware information, e.g., CPU, RAM, storage */}
          <p className="text-white">
            CPU: Intel Core i7-10700K @ 3.80GHz (8 cores)
          </p>
          <p className="text-white">RAM: 16GB</p>
          <p className="text-white">Storage: 512GB SSD, 1TB HDD</p>
        </div>

        {/* Installed Software */}
        <div className="mb-6">
          <h3 className="text-base text-sky-400 flex flex-row items-center">
            Installed Software
            <FiInfo
              className="ml-2 text-yellow-500"
              title={"See more at Software Tab"}
            />
          </h3>
          {/* Display a list of installed software applications */}
          <ul className="list-disc list-inside text-white">
            <li>Operating System: Windows 10 Pro</li>
            <li>Microsoft Office 365</li>
            <li>Google Chrome</li>
            <li>Adobe Photoshop</li>
            <li>Adobe Illustrator</li>
            <li>Visual Studio Code</li>
            <li>Spotify</li>
            {/* Add more software entries as needed */}
          </ul>
        </div>

        {/* System Software Info */}
        <div>
          <h3 className="text-base text-sky-400">
            System Software Information
          </h3>
          {/* Display software-related details, e.g., OS version, build, etc. */}
          <p className="text-white">
            OS Version: Windows 10 Pro (Build 19042.985)
          </p>
          <p className="text-white">System Type: 64-bit operating system</p>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;
