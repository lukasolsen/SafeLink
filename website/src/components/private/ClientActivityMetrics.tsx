import { FiActivity, FiClock } from "react-icons/fi";

const ClientActivitiesMetric: React.FC = () => {
  return (
    <div className="dark:bg-dark-bg-secondary p-4 rounded-lg shadow-md">
      <h2 className="text-lg text-sky-400 mb-4 flex items-center">
        <FiActivity className="mr-2 text-sky-500" /> Client Activities
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <FiActivity className="text-sky-400 text-2xl" />
          <p className="text-sky-400 text-lg font-semibold">Recent Actions</p>
          <p className="text-white text-lg">20</p>
        </div>
        <div className="flex items-center gap-2">
          <FiClock className="text-sky-400 text-2xl" />
          <p className="text-sky-400 text-lg font-semibold">Login History</p>
          <p className="text-white text-lg">Last login 2 days ago</p>
        </div>
      </div>
    </div>
  );
};

export default ClientActivitiesMetric;
