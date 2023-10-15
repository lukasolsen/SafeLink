import React, { useState } from "react";
import { FaMinusCircle, FaCog } from "react-icons/fa"; // Import icons as needed

type CommandBlockProps = {
  currentDirectory: string;
  command: string;
  response: string;
  error: string;
};

const CommandBlock: React.FC<CommandBlockProps> = ({
  currentDirectory,
  command,
  response,
  error,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      className={`flex flex-col gap-y-2 border-t-2 border-b-2 border-gray-500 p-2 transition-all duration-300 relative overflow-hidden ${
        isMinimized ? "justify-center items-center cursor-pointer" : ""
      }`}
      onClick={() => {
        if (isMinimized) {
          setIsMinimized(false);
        }
      }}
    >
      {!isMinimized && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300 w-full">
              {currentDirectory}
            </span>
            <div className="flex items-center">
              <FaCog
                className="text-gray-500 hover:text-blue-500 cursor-pointer mr-2"
                onClick={() => {
                  // Handle settings icon click here
                }}
              />
              <FaMinusCircle
                className="text-red-500 hover:text-blue-500 cursor-pointer"
                onClick={toggleMinimize}
              />
            </div>
          </div>
          <span
            className={`font-semibold ${error ? "text-red-600" : "text-white"}`}
          >
            {command}
          </span>
          <span className={`${error ? "text-red-600" : "text-white"}`}>
            {response ? response : error}
          </span>
        </>
      )}
      {isMinimized && (
        <span
          className={`text-center text-sm ${
            error ? "text-red-600" : "text-white"
          }`}
        >
          {command}
        </span>
      )}
    </div>
  );
};

export default CommandBlock;
