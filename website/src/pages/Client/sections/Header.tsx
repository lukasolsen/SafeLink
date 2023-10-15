import { MdComputer, MdInfo } from "react-icons/md";

type HeaderProps = {
  client: Victim;
};

const Header: React.FC<HeaderProps> = ({ client }) => {
  return (
    <div className="bg-white dark:bg-dark-bg-secondary rounded-b-sm p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Status Wheel */}
          <div className="w-16 h-16 rounded-full border-8 border-sky-500 flex items-center justify-center">
            <div
              className={`w-10 h-10 rounded-full ${
                client.status.toLowerCase() === "online"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300">
              {client.computer_name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              IP Address: {client.ipv4}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="flex items-center">
          <div className="mr-4">
            <MdComputer
              size={24}
              className="text-gray-600 dark:text-gray-400"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              {client.os} - {client.architecture}
            </span>
          </div>
          <div>
            <MdInfo size={24} className="text-sky-500" />
            <span className="text-sm text-sky-500 ml-1">
              Dangerous Vulnerability
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
