import { FiActivity } from "react-icons/fi";
import SystemInfo from "./Details/SystemInfo";
import NetworkInfo from "./Details/NetworkInfo";
import SecurityInfo from "./Details/SecurityInfo";

type DetailsProps = {
  client: Victim;
};

const Details: React.FC<DetailsProps> = ({ client }) => {
  return (
    <div className="dark:bg-dark-bg bg-dark-bg-secondary p-6 min-h-screen">
      <h1 className="text-2xl text-white mb-6">Details</h1>

      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        {/* System Info */}
        <SystemInfo />

        {/* Network Info */}
        <NetworkInfo />

        {/* Security Info */}
        <SecurityInfo />

        {/* User Activity */}
        <div>
          <h2 className="text-lg text-sky-400 flex items-center">
            <FiActivity className="mr-2" /> User Activity
          </h2>
          {/* Display user login history, activities, and access control settings */}
        </div>
      </div>
    </div>
  );
};

export default Details;
