import React, { memo, useEffect, useMemo, useState } from "react";
import { FiDatabase, FiFile, FiHardDrive } from "react-icons/fi";
import SecurityStatusMetric from "../../../components/private/SecurityStatusMetrics";
import ClientActivitiesMetric from "../../../components/private/ClientActivityMetrics";
import { get_client_disk, get_client_logs } from "../../../service/api.service";
import Table from "../../../components/Table";
import { Cell, Row } from "react-table";
import { FaClipboard, FaCog, FaFileAlt } from "react-icons/fa";
import Search from "../../../components/Search";
import Select from "../../../components/Select";

const MetricCard: React.FC<{
  title: string;
  value: string;
  max: number;
  unit: string;
}> = ({ title, value, max, unit }) => {
  const usedPercentage = ((parseInt(value, 10) / max) * 100).toFixed(2);
  const colorClass = parseInt(usedPercentage) > 80 ? "red-400" : "green-400";
  const bgColor = parseInt(usedPercentage) > 80 ? "bg-red-400" : "bg-green-400";

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
          <p className="text-gray-400">Used</p>
        </div>
        <div>
          <p className="text-3xl font-semibold text-white">
            {max} {unit}
          </p>
          <p className="text-gray-400">Total</p>
        </div>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span
              className={`text-xs font-semibold inline-block py-1 px-2 rounded-full bg-${colorClass} text-white`}
            >
              {usedPercentage}% Used
            </span>
          </div>
        </div>
        <div className="relative">
          <div className="h-2 mt-2 w-full bg-gray-600 rounded-full">
            <div
              style={{ width: `${usedPercentage}%` }}
              className={`h-2 rounded-full ${bgColor}`}
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
interface ClientOverviewProps {
  id: string;
}

type LogType = {
  part: string;
  message: string;
  timestamp: string;
};

type LogPart = {
  color: string;
  icon?: React.ReactNode;
  name: string;
};

const ClientOverview: React.FC<ClientOverviewProps> = ({ id }) => {
  const [disk, setDisk] = useState<DiskType>({
    Total: "",
    Used: "",
    Free: "",
    Percent: "",
  });
  const [logCooldown, setLogCooldown] = useState<number>(0);
  const [logs, setLogs] = useState<LogType[]>([]);
  const [curPage, setCurPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [select, setSelect] = useState<string>("process");

  const logParts: LogPart[] = [
    {
      color: "green-500",
      icon: <FaCog />,
      name: "process",
    },
    {
      color: "purple-500",
      icon: <FaClipboard />,
      name: "clipboard",
    },
  ];

  useEffect(() => {
    const getDiskInformation = async () => {
      try {
        const response = await get_client_disk(id);
        setDisk(response.data.disk);
      } catch (error) {
        console.error("Error fetching disk information:", error);
      }
    };

    getDiskInformation();
  }, [id]);

  useEffect(() => {
    if (logCooldown === 0) {
      // Clear previous logs
      //setLogs([]);

      const getLogs = async () => {
        try {
          const response = await get_client_logs(id);
          setLogs(response.data.logs);
        } catch (error) {
          console.error("Error fetching logs:", error);
        }
      };
      getLogs();
      setLogCooldown(5);
    }

    const interval = setInterval(() => {
      setLogCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [logCooldown, id]);

  // Memoize columns to prevent unnecessary re-renders
  const columns = useMemo(
    () => [
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
    ],
    []
  );

  const filteredLogs = useMemo(() => {
    console.log(select);
    return logs.filter(
      (log) =>
        log.message.toLowerCase().includes(search.toLowerCase()) &&
        log.part === select
    );
  }, [logs, search, select]);

  // Memoize renderData function to avoid re-creating it on each render
  const renderData = useMemo(() => {
    return (cell: Cell, row: Row<object>, key?: number) => {
      if (cell.column.id === "part") {
        return (
          <td key={key} className="p-2 border-b border-gray-700">
            <span
              className={`text-sm font-medium text-${
                logParts.find((part) => part.name === cell.value)?.color
              } ${
                logParts.find((part) => part.name === cell.value)?.icon &&
                "flex items-center"
              }`}
            >
              {logParts.find((part) => part.name === cell.value)?.icon && (
                <span className="mr-2">
                  {logParts.find((part) => part.name === cell.value)?.icon}
                </span>
              )}
              {/* Make it start with an uppercase */}
              {cell.value.charAt(0).toUpperCase() + cell.value.slice(1)}
            </span>
          </td>
        );
      }
      if (cell.column.id === "message") {
        return (
          <td
            key={key}
            className="p-2 border-b border-gray-700 overflow-auto w-6/12"
          >
            {cell.value}
          </td>
        );
      }
      return (
        <td key={key} className="p-2 border-b border-gray-700">
          {cell.value}
        </td>
      );
    };
  }, [logParts]);

  const options = logParts.map((part) => ({
    label: part.name,
    value: part.name,
  }));

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
          <div className="flex flex-row justify-between items-center mb-4">
            <Select options={options} onChange={(value) => setSelect(value)} />
            <Search onSearch={(value) => setSearch(value)} />
          </div>

          <Table
            columns={columns}
            data={filteredLogs}
            renderData={renderData}
            curPage={curPage}
            changePage={setCurPage}
            pagination
          />
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
