import { useState } from "react";
import Search from "../../../components/Search";

type Process = {
  name: string;
  pid: number;
  ppid: number;
  user: string;
  "memory usage": number;
  "cpu usage": number;
  status: string;
  "execution path": string;

  properties: {
    start_time: string;
    command_line: string;
    environment: string;
    threads: string;
    handles: string;
    dlls: string;
  }
};

const ProcessesTab = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [search, setSearch] = useState<string>("");

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold text-sky-600">Processes</h1>

      {/* Process Controls */}
      <div className="bg-dark-bg-secondary rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold text-white mb-4">
          Process Controls
        </h2>

        {/* Process Control Buttons */}
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-x-2">
            <button
              className="border border-sky-500 text-white px-2 py-2 rounded-md hover:border-sky-700 focus:outline-none transition-all duration-300 disabled:border-sky-700"
              disabled
            >
              Start Process
            </button>
            <button
              className="border border-red-500 text-white px-2 py-2 rounded-md hover:border-red-700 focus:outline-none transition-all duration-300 disabled:border-red-700"
              disabled
            >
              Stop Process
            </button>
            <button
              className="border border-yellow-500 text-white px-2 py-2 rounded-md hover:border-yellow-700 focus:outline-none transition-all duration-300 disabled:border-yellow-700"
              disabled
            >
              Restart Process
            </button>
            <button
              className="border border-purple-500 text-white px-2 py-2 rounded-md hover:border-purple-700 focus:outline-none transition-all duration-300 disabled:border-purple-700"
              disabled
            >
              Configure Process
            </button>
          </div>

          {/* Process Search */}
          <Search
            placeholder="Search Processes..."
            onSearch={(value) => setSearch(value)}
          />
        </div>
      </div>

      {/* Process List */}
      <div className="bg-dark-bg-secondary rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold text-white mb-4">Process List</h2>

        {/* Process Table */}
        <table className="w-full text-white">
          <thead>
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">ID</th>
              <th className="p-2">Status</th>
              <th className="p-2">CPU Usage</th>
              <th className="p-2">Memory Usage</th>
            </tr>
          </thead>
          <tbody>{/* Process rows go here */}</tbody>
        </table>
      </div>
    </div>
  );
};

export default ProcessesTab;
