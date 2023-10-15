import React, { useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";

const FirewallSettings: React.FC = () => {
  const [firewallEnabled, setFirewallEnabled] = useState(true);
  const [blockInboundTraffic, setBlockInboundTraffic] = useState(false);
  const [blockOutboundTraffic, setBlockOutboundTraffic] = useState(false);
  const [notificationLevel, setNotificationLevel] = useState("medium");

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="p-4 rounded-lg ">
          <h3 className="text-lg text-sky-400 mb-2">General Settings</h3>
          <div className="flex items-center justify-between mb-2">
            <div>Firewall Enabled</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={firewallEnabled}
                  onChange={() => setFirewallEnabled(!firewallEnabled)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div>Block Inbound Traffic</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={blockInboundTraffic}
                  onChange={() => setBlockInboundTraffic(!blockInboundTraffic)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>Block Outbound Traffic</div>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={blockOutboundTraffic}
                  onChange={() =>
                    setBlockOutboundTraffic(!blockOutboundTraffic)
                  }
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="p-4 rounded-lg ">
          <h3 className="text-lg text-sky-400 mb-2">Notification Settings</h3>
          <div className="mb-2">
            <div>Notification Level</div>
            <div>
              <select
                value={notificationLevel}
                onChange={(e) => setNotificationLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-sky-400 dark:bg-dark-bg-secondary dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sky-400 font-semibold">Advanced Settings</div>
            <div className="mt-2">
              <div>
                <div className="mb-2">Custom Firewall Rules</div>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 h-24 focus:outline-none focus:border-sky-400 dark:bg-dark-bg-secondary dark:text-white"
                  placeholder="Add custom firewall rules..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end mt-4">
        <button className="bg-sky-400 text-white p-2 rounded-md">
          <FiCheck className="mr-2" /> Save
        </button>
        <button className="bg-gray-300 text-gray-700 p-2 ml-2 rounded-md">
          <FiX className="mr-2" /> Cancel
        </button>
      </div>
    </div>
  );
};

export default FirewallSettings;
