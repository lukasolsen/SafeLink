import React, { useState } from "react";
import {
  FiShield,
  FiAlertTriangle,
  FiHome,
  FiSearch,
  FiBook,
} from "react-icons/fi";
import AntivirusSection from "./SecurityMonitoring/AntivirusSection";
import FirewallPage from "./SecurityMonitoring/FirewallSection";

const SecurityMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "Antivirus", icon: <FiShield /> },
    { title: "Firewall", icon: <FiAlertTriangle /> },
    { title: "Intrusion Detection", icon: <FiHome /> },
    { title: "Vulnerability Scans", icon: <FiSearch /> },
    { title: "Logs", icon: <FiBook /> },
  ];

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="p-4">
      <div className="flex space-x-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${
              activeTab === index
                ? "text-sky-400 dark:bg-dark-bg-secondary"
                : "text-gray-300 hover:text-sky-400 hover:bg-dark-bg-secondary"
            } px-4 py-2 rounded-lg focus:outline-none flex items-center space-x-2`}
            onClick={() => handleTabClick(index)}
          >
            {tab.icon}
            <span>{tab.title}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="mt-8">
        {activeTab === 0 && <AntivirusSection />}
        {activeTab === 1 && <FirewallPage />}
        {activeTab === 2 && (
          <div className="dark:bg-dark-bg-secondary p-4 rounded-lg shadow-md"></div>
        )}
        {activeTab === 3 && (
          <div className="dark:bg-dark-bg-secondary p-4 rounded-lg shadow-md"></div>
        )}
        {activeTab === 4 && (
          <div className="dark:bg-dark-bg-secondary p-4 rounded-lg shadow-md"></div>
        )}
      </div>
    </div>
  );
};

export default SecurityMonitoring;
