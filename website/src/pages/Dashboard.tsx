import React from "react";
import Home from "./dashboard/Home";

const Dashboard: React.FC = () => {
  return (
    <div>
      {/* Main content */}
      <main className="flex-1 transition-transform duration-300 transform container mx-auto p-4">
        {/* Render content based on the tab */}
        <Home />
      </main>
    </div>
  );
};

export default Dashboard;
