import { useState } from "react";
import {
  FiShield,
  FiAlertCircle,
  FiCheck,
  FiPlus,
  FiMinus,
} from "react-icons/fi";

const SecurityInfo: React.FC = () => {
  const [minimized, setMinimized] = useState(false);

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  return (
    <div className="dark:bg-dark-bg-secondary p-4 rounded-lg shadow-md mb-8">
      <h2 className="text-lg text-white mb-4 flex items-center">
        <FiShield className="mr-2 text-sky-400" /> Security Info
        <button className="ml-auto focus:outline-none" onClick={toggleMinimize}>
          {minimized ? <FiPlus /> : <FiMinus />}
        </button>
      </h2>
      <div className={`flex flex-wrap gap-4 mt-4 ${minimized ? "hidden" : ""}`}>
        <div className="w-full md:w-1/2 lg:w-1/3">
          <div className="border border-gray-600 p-4 rounded-lg">
            <h3 className="text-base text-sky-400">Recent Security Events</h3>
            <div className="mt-4">
              <ul className="list-disc list-inside text-white">
                <li className="flex items-center">
                  <span className="text-red-400 mr-2">
                    <FiAlertCircle />
                  </span>
                  Suspicious file detected
                </li>
                <li className="flex items-center">
                  <span className="text-red-400 mr-2">
                    <FiAlertCircle />
                  </span>
                  Unauthorized login attempt
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">
                    <FiAlertCircle />
                  </span>
                  Firewall alert
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3">
          <div className="border border-gray-600 p-4 rounded-lg">
            <h3 className="text-base text-sky-400">Threat Alerts</h3>
            <div className="mt-4">
              <ul className="list-disc list-inside text-white">
                <li className="flex items-center">
                  <span className="text-red-400 mr-2">
                    <FiAlertCircle />
                  </span>
                  Malware detected
                </li>
                <li className="flex items-center">
                  <span className="text-red-400 mr-2">
                    <FiAlertCircle />
                  </span>
                  Phishing attack detected
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">
                    <FiAlertCircle />
                  </span>
                  Suspicious network activity
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3">
          <div className="border border-gray-600 p-4 rounded-lg">
            <h3 className="text-base text-sky-400">Antivirus Status</h3>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">
                  <FiCheck />
                </span>
                Your antivirus is up to date
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3">
          <div className="border border-gray-600 p-4 rounded-lg">
            <h3 className="text-base text-sky-400">Firewall Status</h3>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">
                  <FiCheck />
                </span>
                Your firewall is active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityInfo;
