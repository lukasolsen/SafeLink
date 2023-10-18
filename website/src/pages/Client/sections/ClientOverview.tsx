import React, { useEffect, useState } from "react";
import { FiHardDrive } from "react-icons/fi";
import SecurityStatusMetric from "../../../components/private/SecurityStatusMetrics";
import ClientActivitiesMetric from "../../../components/private/ClientActivityMetrics";
import { get_client_disk, get_client_logs } from "../../../service/api.service";
import Table from "../../../components/Table";
import { Cell, Row } from "react-table";
import { FaFileAlt } from "react-icons/fa";

const MetricCard: React.FC<{
  title: string;
  value: string;
  max: number;
  unit: string;
}> = ({ title, value, max, unit }) => {
  const usedPercentage = ((parseInt(value, 10) / max) * 100).toFixed(2);
  const colorClass = parseInt(usedPercentage) > 80 ? "red-400" : "green-400";

  return (
    <div className={`dark:bg-dark-bg-secondary p-4 rounded-lg shadow-md`}>
      <h2 className="text-lg text-white mb-4 flex items-center">
        <FiHardDrive className="mr-2 text-sky-400" /> {title}
      </h2>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-3xl font-semibold text-${colorClass}`}>
            {value} {unit}
          </p>
          <p className={`text-gray-400`}>Used</p>
        </div>
        <div>
          <p className={`text-3xl font-semibold text-white`}>
            {max} {unit}
          </p>
          <p className={`text-gray-400`}>Total</p>
        </div>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span
              className={`text-xs font-semibold inline-block py-1 px-2 rounded-full text-${colorClass}`}
            >
              {usedPercentage}% Used
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="h-2 mt-2 w-full bg-gray-600 rounded-full">
            <div
              style={{ width: `${usedPercentage}%` }}
              className={`h-2 rounded-full bg-${colorClass}`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientVersionAndUpdates: React.FC = () => {
  return (
    <div className="bg-dark-bg-secondary rounded-lg p-4 mt-6">
      <h2 className="text-xl font-semibold mb-4">Client Version and Updates</h2>
      <div className="flex flex-row items-center justify-between">
        <div>
          <p className="text-gray-400">Client Version</p>
          <p className="text-xl font-semibold">1.0.0</p>
        </div>
        <div>
          <p className="text-gray-400">Last Update Check</p>
          <p className="text-xl font-semibold">1.0.0</p>
        </div>
      </div>
    </div>
  );
};

const ClientActivationButtons: React.FC = () => {
  return (
    <div className="bg-dark-bg-secondary rounded-lg p-4 mt-6">
      <h2 className="text-xl font-semibold mb-4">Client Activation</h2>
      <div className="flex flex-row items-center justify-between">
        <div>
          <p className="text-gray-400">Client Activation</p>
          <p className="text-xl font-semibold">Activated</p>
        </div>
        <div>
          <p className="text-gray-400">Last Activation</p>
          <p className="text-xl font-semibold">1.0.0</p>
        </div>
      </div>
    </div>
  );
};

const SecurityAlertsTab: React.FC = () => {
  return (
    <div className="bg-dark-bg-secondary rounded-lg p-4 mt-6">
      <h2 className="text-xl font-semibold mb-4">Security Alerts</h2>
      <div className="flex flex-row items-center justify-between">
        <div>
          <p className="text-gray-400">Security Alerts</p>
          <p className="text-xl font-semibold">Activated</p>
        </div>
        <div>
          <p className="text-gray-400">Last Security Alert</p>
          <p className="text-xl font-semibold">1.0.0</p>
        </div>
      </div>
    </div>
  );
};

type DiskType = {
  Total: string;
  Used: string;
  Free: string;
  Percent: string;
};

type ClientOverViewProps = {
  id: string;
};

const ClientOverview: React.FC<ClientOverViewProps> = ({ id }) => {
  const [disk, setDisk] = useState<DiskType>({
    Total: "",
    Used: "",
    Free: "",
    Percent: "",
  });
  const [logCooldown, setLogCooldown] = useState<number>(0);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const getDiskInformation = async () => {
      get_client_disk(id).then((response) => {
        console.log(response.data);
        setDisk(response.data.disk);
      });
    };

    getDiskInformation();
    console.log(disk);
  }, []);

  useEffect(() => {
    if (logCooldown === 0) {
      const getLogs = async () => {
        get_client_logs(id).then((response) => {
          setLogs(response.data.logs);
          console.log(response.data.logs);
          response.data.logs.map((log) => {
            console.log(log.message);
          });
        });
      };
      getLogs();
      setLogCooldown(5);
    }

    const interval = setInterval(() => {
      setLogCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [logCooldown]);

  const columns = [
    {
      Header: "Type",
      accessor: "part",
    },
    {
      Header: "Message",
      accessor: "message",
    },
    {
      Header: "Timestamp",
      accessor: "timestamp",
    },
  ];

  const renderData = (cell: Cell, row: Row<object>, key?: number) => {
    if (cell.column.id === "part") {
      return (
        <td key={key} className="p-2 border-b border-gray-700">
          <span
            className={`text-sm font-medium ${
              cell.value === "process" ? "text-green-500" : "text-yellow-500"
            }`}
          >
            {/* Make it start with a uppercase */}
            {cell.value.charAt(0).toUpperCase() + cell.value.slice(1)}
          </span>
        </td>
      );
    }

    return (
      <td key={key} className="p-2 border-b border-gray-700">
        {cell.value}
      </td>
    );
  };

  return (
    <div className="dark:bg-dark-bg bg-dark-bg-secondary min-h-screen p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-96 h-[60vh]">
        {/* Disk Space Metric */}
        <MetricCard
          title="Disk Space"
          value={disk?.Used}
          max={parseInt(disk?.Total)}
          unit="GB"
        />

        <div className="bg-dark-bg-secondary rounded-lg p-4">
          <h2 className="text-lg text-white mb-4 flex items-center">
            <FaFileAlt className="mr-2 text-blue-500" /> Client Logs
          </h2>
          <Table columns={columns} data={logs} renderData={renderData} />
        </div>
      </div>

      {/*<SecurityStatusMetric />*/}

      {/*<div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4">
        <ClientActivitiesMetric />

        {/* Additional content goes here }
        {/* Include Client Version and Update Check }
        <ClientVersionAndUpdates />

        {/* Include Client Activation Buttons }
        <ClientActivationButtons />

        {/* Include Security Alerts Tab }
        <SecurityAlertsTab />
      </div>*/}
    </div>
  );
};

export default ClientOverview;
