import React, { useEffect, useState } from "react";
import { FiHardDrive } from "react-icons/fi";
import SecurityStatusMetric from "../../../components/private/SecurityStatusMetrics";
import ClientActivitiesMetric from "../../../components/private/ClientActivityMetrics";
import { get_client_disk } from "../../../service/api.service";

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

  return (
    <div className="dark:bg-dark-bg bg-dark-bg-secondary min-h-screen p-6">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Disk Space Metric */}
        <MetricCard
          title="Disk Space"
          value={disk?.Used}
          max={parseInt(disk?.Total)}
          unit="GB"
        />

        <SecurityStatusMetric />

        {/* Client Activities Metric */}
        <ClientActivitiesMetric />
      </div>

      {/* Additional Content */}
      <div className="mt-8">{/* Additional content goes here */}</div>
    </div>
  );
};

export default ClientOverview;
