import { Outlet, useLocation } from "react-router-dom";
import DashboardNavbar from "./components/DashboardNavbar";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const [tab, setTab] = useState("dashboard");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/clients")) {
      setTab("clients");
    } else if (location.pathname.includes("/dashboard")) {
      setTab("dashboard");
    }
  }, []);

  return (
    <div className="h-full min-h-screen grid grid-cols-12">
      <DashboardNavbar tab={tab} changeTab={setTab} />
      <div className="col-span-11 container mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
