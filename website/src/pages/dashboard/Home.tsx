import React from "react";

const Home: React.FC = () => {
  const tempAlerts = [
    {
      severity: "Critical",
      timestamp: new Date().toISOString(),
      computerName: "LUKAS",
      os: "Windows",
      architecture: "64bit",
    },
    {
      severity: "Warning",
      timestamp: new Date().toISOString(),
      computerName: "John",
      os: "Linux",
      architecture: "64bit",
    },
  ];

  return (
    <div className="w-full">
      <div className="w-full h-full">
        <div className="grid grid-cols-6 grid-rows-5 gap-4 h-full">
          <div className="col-span-6 w-10/12 mx-auto">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-evenly">
                {/* Warning Alert */}
                <div className="flex flex-row items-center">
                  <div className="text-2xl p-2 rounded-2xl bg-yellow-600 text-white mr-2 h-12 w-12 flex justify-center items-center">
                    2
                  </div>
                  <p className="text-sm text-gray-300">Warnings alerts</p>
                </div>

                {/* Critical Alert */}
                <div className="flex flex-row items-center ml-4">
                  <div className="text-2xl p-2 rounded-2xl bg-red-600 text-white mr-2 h-12 w-12 flex justify-center items-center">
                    1
                  </div>
                  <p className="text-sm text-gray-300">Critical alerts</p>
                </div>
              </div>

              {/* Ticket System */}
              <div className="flex flex-row items-center justify-evenly">
                {/* Open Tickets */}
                <div className="flex flex-row items-center">
                  <div className="text-2xl p-2 rounded-2xl bg-purple-600 text-white mr-2 h-12 w-12 flex justify-center items-center">
                    2
                  </div>
                  <p className="text-sm text-gray-300">Open tickets</p>
                </div>

                {/* Pending Tickets */}
                <div className="flex flex-row items-center ml-4">
                  <div className="text-2xl p-2 rounded-2xl bg-blue-600 text-white mr-2 h-12 w-12 flex justify-center items-center">
                    1
                  </div>
                  <p className="text-sm text-gray-300">Pending tickets</p>
                </div>

                {/* Closed Tickets */}
                <div className="flex flex-row items-center ml-4">
                  <div className="text-2xl p-2 rounded-2xl bg-green-600 text-white mr-2 h-12 w-12 flex justify-center items-center">
                    1
                  </div>
                  <p className="text-sm text-gray-300">Closed tickets</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 row-span-2 row-start-2">
            <div className="container mx-auto">
              <h2 className="dark:text-white text-base font-semibold">
                Recent Alerts
              </h2>
              <ul className="gap-2">
                {tempAlerts.map((alert, index: number) => (
                  <li
                    key={index}
                    className="flex flex-col border-b border-b-gray-800 pb-4"
                  >
                    <div className="flex flex-row items-center gap-2">
                      <span className="p-1 bg-red-600 rounded-lg text-sm">
                        {alert.severity}
                      </span>
                      <span className="text-sm">
                        {new Date(alert.timestamp).toUTCString()} (4 hours ago)
                      </span>
                    </div>
                    <div className="flex flex-row justify-between text-sm">
                      <span>{alert.computerName}</span>
                      <span>
                        {alert.os} - {alert.architecture}
                      </span>
                    </div>
                    <p className="text-sm">
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-span-2 row-span-2 col-start-3 row-start-2">3</div>
          <div className="col-span-2 row-span-2 col-start-5 row-start-2">4</div>
          <div className="col-span-2 row-span-2 row-start-4">5</div>
          <div className="col-span-2 row-span-2 col-start-3 row-start-4">6</div>
          <div className="col-span-2 row-span-2 col-start-5 row-start-4">7</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
