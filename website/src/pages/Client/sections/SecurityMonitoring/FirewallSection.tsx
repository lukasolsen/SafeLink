import React, { useState } from "react";
import { FiShield } from "react-icons/fi";
import FirewallRulesTable from "./FirewallRulesTab";
import FirewallSettings from "./FirewallSettings"; // Import the FirewallSettings component

const FirewallPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("rules"); // Manage active tab

  return (
    <div className="dark:bg-dark-bg-secondary p-4 rounded-lg shadow-md">
      <h2 className="text-lg text-sky-400 flex items-center">
        <FiShield className="mr-2" /> Firewall
      </h2>
      <div className="mt-4">
        {/* Tab buttons */}
        <div className="flex space-x-4">
          <button
            className={`${
              activeTab === "rules"
                ? "bg-sky-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-sky-600 rounded p-2 flex items-center font-semibold`}
            onClick={() => setActiveTab("rules")}
          >
            Firewall Rules
          </button>
          <button
            className={`${
              activeTab === "settings"
                ? "bg-sky-500 text-white"
                : "bg-gray-200 text-gray-700"
            } hover:bg-sky-600 rounded p-2 flex items-center font-semibold`}
            onClick={() => setActiveTab("settings")}
          >
            Firewall Settings
          </button>
        </div>

        {/* Tab content */}
        <div className="mt-4">
          {activeTab === "rules" && (
            <div>
              <FirewallRulesTable />
            </div>
          )}
          {activeTab === "settings" && (
            <div>
              <FirewallSettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirewallPage;
