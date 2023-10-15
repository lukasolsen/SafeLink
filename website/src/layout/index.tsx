import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Layout: React.FC = () => {
  const pathname = useLocation().pathname;
  const { checkToken, isLoggedIn, userDetails } = useAuth();

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <>
      <div className="dark:bg-dark-bg dark:text-white text-black bg-slate-100 overscroll-auto h-full min-h-screen break-all">
        {!pathname.includes("/profile") && (
          <Navbar hasAccount={isLoggedIn} userDetails={userDetails} />
        )}
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
