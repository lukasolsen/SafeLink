import { FaBriefcase, FaCog, FaSearch, FaUsers } from "react-icons/fa";

type DashboardProps = {
  tab: string;
  changeTab: (newTab: string) => void;
};

const DashboardNavbar: React.FC<DashboardProps> = ({ changeTab, tab }) => {
  return (
    <aside className="w-8/12 h-full dark:bg-gray-800 text-white overflow-y-auto transition-transform duration-300 transform">
      <nav className="p-4 space-y-4 w-full flex flex-col justify-center">
        {/* Sidebar links */}
        <a
          href="/dashboard"
          className={`py-2 px-4 hover:text-blue-600 w-full rounded-sm ${
            tab === "dashboard" ? "text-blue-600" : ""
          }`}
        >
          <FaBriefcase className="text-xl" />
        </a>
        <a
          href="/dashboard/clients"
          className={`py-2 px-4 hover:text-blue-600 w-full rounded-sm ${
            tab === "clients" ? "text-blue-600" : ""
          }`}
        >
          <FaUsers className="text-xl" />
        </a>
        <a
          href="/dashboard/clients"
          className={`py-2 px-4 hover:text-blue-600 w-full rounded-sm ${
            tab === "search" ? "text-blue-600" : ""
          }`}
        >
          <FaSearch className="text-xl" />
        </a>
        <a
          href="/dashboard/clients"
          className={`py-2 px-4 hover:text-blue-600 w-full rounded-sm ${
            tab === "settings" ? "text-blue-600" : ""
          }`}
        >
          <FaCog className="text-xl" />
        </a>
      </nav>
    </aside>
  );
};

export default DashboardNavbar;
