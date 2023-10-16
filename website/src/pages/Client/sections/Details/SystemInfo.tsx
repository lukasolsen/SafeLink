import React, { useEffect, useState } from "react";
import { FiInfo, FiServer, FiMinus, FiPlus } from "react-icons/fi";
import { get_client_hardware } from "../../../../service/api.service";
import { useLocation } from "react-router-dom";

type SystemInfoType = {
  CPU: {
    Cores: number;
    "Max Speed": string;
    "Min Speed": string;
    Name: string;
    "Physical Cores": number;
    Speed: string;
    Times: {
      DPS: number;
      IDLE: number;
      Interupt: number;
      System: number;
      User: number;
    };
    Usage: string;
    "Virtual Cores": number;
  };
  Disk: {
    Free: string;
    Percent: string;
    "Read Bytes": string;
    "Read Count": number;
    "Read Time": number;
    Total: string;
    Used: string;
    "Write Bytes": string;
    "Write Count": number;
    "Write Time": number;
  };
  RAM: {
    Free: string;
    Percent: string;
    Total: string;
    Used: string;
    "Swap Free": string;
    "Swap Percent": string;
    "Swap Total": string;
    "Swap Used": string;
  };
  System: {
    "Boot Time": number;
    "Idle Time": number;
    OS: string;
    "OS Architecture": string;
    "OS Platform": string;
    "OS Release": string;
    "OS Machine": string;
    "OS Version": string;
  };
};

const SystemInfo: React.FC = () => {
  const [minimized, setMinimized] = useState(false);
  const [data, setData] = useState<SystemInfoType>();
  const location = useLocation();

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  useEffect(() => {
    const getData = async () => {
      const id = location.pathname.split("/")[3];

      get_client_hardware(id).then((res) => {
        console.log(res.data.hardware);
        setData(res.data.hardware);
      });
    };

    getData();
  }, []);

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
          {/* Intel Core i7-10700K */}
          <p className="text-white">
            CPU: {data?.CPU.Name} @ {data?.CPU.Speed} ({data?.CPU.Cores})
          </p>
          <p className="text-white">RAM: {data?.RAM.Total}</p>
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
          {/* Windows 10 Pro (Build 19042.985) */}
          <p className="text-white">
            OS Version: {data?.System["OS Platform"]}
          </p>
          <p className="text-white">
            System Type: {data?.System["OS Architecture"]} operating system
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemInfo;
