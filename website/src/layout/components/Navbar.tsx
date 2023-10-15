import { FaUserCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

type NavbarProps = {
  hasAccount: boolean;
  userDetails?: { username: string; email: string };
};

const Navbar: React.FC<NavbarProps> = ({ hasAccount, userDetails }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname.includes("/login") ||
      location.pathname.includes("/register") ? null : (
        <div className="flex flex-row justify-between items-center w-full p-4 pt-2 dark:text-white text-black border-b border-b-sky-400">
          <Link to={`${hasAccount ? "/dashboard" : "/"}`}>
            <h1 className="text-2xl font-bold text-sky-500">SafeLink</h1>
          </Link>

          <div className="flex flex-row space-x-2 items-center">
            <Link
              to="/"
              className={`${location.pathname === "/" ? "text-sky-400" : ""}`}
            >
              Home
            </Link>

            {hasAccount && (
              <Link
                to="/dashboard"
                className={`dark:bg-dark-bg-secondary dark:hover:bg-dark-bg flex flex-row items-center rounded-lg p-1 gap-2 justify-between ${
                  location.pathname === "/dashboard" ? "text-sky-400" : ""
                }`}
              >
                {userDetails?.username || "My Profile"}
                <div className="flex items-center">
                  <FaUserCircle className="text-2xl" />
                </div>
              </Link>
            )}
          </div>

          {!hasAccount && (
            <div className="flex flex-row space-x-4 items-center">
              <Link to="/login">Login</Link>
              <Link
                to="/register"
                className="p-2 rounded-3xl border border-gray-500"
              >
                Try it out
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
