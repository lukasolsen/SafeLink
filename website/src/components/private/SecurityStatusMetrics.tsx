import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { FiShield, FiUserCheck, FiUserX } from "react-icons/fi";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const SecurityStatusMetric: React.FC = () => {
  const securityData = {
    labels: ["Antivirus", "Firewall", "Updates", "Intrusion Detection"],
    datasets: [
      {
        label: "Status",
        data: [8, 1, 0, 1], // 1 for "Protected," 0 for "Threat Detected"
        backgroundColor: ["#00C853", "#00C853", "#FF3D00", "#00C853"],
        borderWidth: 1,
        borderColor: "#333", // Border color
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#888", // X-axis label color
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="dark:bg-dark-bg-secondary p-4 rounded-lg shadow-md">
      <h2 className="text-lg text-white mb-4 flex items-center">
        <FiShield className="mr-2 text-blue-500" /> Security Status
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <FiUserCheck className="text-green-400 text-lg" />
          <p className="text-green-400 text-base font-semibold">Protected</p>
        </div>
        <div className="flex items-center gap-2">
          <FiUserX className="text-red-400 text-lg" />
          <p className="text-red-400 text-base font-semibold">
            Threat Detected
          </p>
        </div>
      </div>
      <div className="mt-6">
        <Bar data={securityData} options={chartOptions} />
      </div>
    </div>
  );
};

export default SecurityStatusMetric;
