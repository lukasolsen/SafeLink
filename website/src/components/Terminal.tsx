import { FaPlus } from "react-icons/fa";
import {
  get_powershell_suggestions_terminal,
  runVictimCommand,
} from "../service/api.service";
import React, { useState, useEffect } from "react";
import CommandBlock from "./CommandBlock";

type TerminalProps = {
  id: string;
  currentDirectory: string;
};

type TerminalTab = {
  name: string; // Name of the tab
  commands: string[]; // Commands executed in the tab
  responses: CommandResultType[]; // Responses to the commands
};

type PowerShellCommand = {
  Source: string;
  Description?: string;
  CommandType?: number;
  version: string;
  Syntax?: {
    syntaxItem: string;
  };
  CommandTypeName: null;
  Name: string;
  ModuleName: string;
};

const Terminal: React.FC<TerminalProps> = ({ id, currentDirectory }) => {
  const [command, setCommand] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Powershell"); // Default language

  const [terminalTabs, setTerminalTabs] = useState<TerminalTab[]>([
    { name: "Tab-1", commands: [], responses: [] },
  ]);
  const [currentTab, setCurrentTab] = useState("Tab-1");
  const [suggestions, setSuggestions] = useState<PowerShellCommand[]>([]);

  const executeCommand = async () => {
    try {
      const result = await runVictimCommand(
        id,
        command,
        selectedLanguage.toLowerCase()
      );
      const newResponse: CommandResultType = result.data.output;
      // this is currently a string, turn it into an object
      console.log(newResponse);
      const currentTabData = terminalTabs.find(
        (terminalTab) => terminalTab.name === currentTab
      );
      if (currentTabData === undefined) {
        setTerminalTabs([
          ...terminalTabs,
          { name: currentTab, commands: [command], responses: [newResponse] },
        ]);
      } else {
        currentTabData.commands.push(command);
        currentTabData.responses.push(newResponse);
      }

      setCommand("");
    } catch (error) {
      const currentTabData = terminalTabs.find(
        (terminalTab) => terminalTab.name === currentTab
      );
      if (currentTabData === undefined) {
        setTerminalTabs([
          ...terminalTabs,
          { name: currentTab, commands: [command], responses: [error.message] },
        ]);
      } else {
        currentTabData.commands.push(command);
        currentTabData.responses.push(error.message);
      }
    }
  };

  const changeTab = (tab: string) => {
    setCurrentTab(tab);
  };

  const getTab = (tab: string) => {
    return terminalTabs.find((terminalTab) => terminalTab.name === tab);
  };

  const addTab = () => {
    setTerminalTabs([
      ...terminalTabs,
      {
        name: "New Tab (" + terminalTabs.length + ")",
        commands: [],
        responses: [],
      },
    ]);
    setCurrentTab("New Tab (" + terminalTabs.length + ")");
  };

  let debounceTimer: number;

  useEffect(() => {
    // Clear the previous timer if it exists
    clearTimeout(debounceTimer);

    // Set a new timer to execute the get_data function after a delay
    debounceTimer = setTimeout(() => {
      if (command.length === 0) {
        setSuggestions([]);
      } else {
        const get_data = async () => {
          const data = await get_powershell_suggestions_terminal(
            "1",
            command
          ).then((result) => {
            // Change the description
            /* 
          Example Description: "Description":  [
                            "@{Text=This cmdlet is used to install .ppkg files that are generated and exported by the Windows Configuration Designer tool (/windows/configuration/provisioning-packages/provisioning-install-icd).\r\n}",
                            "@{Text=The Install-ProvisioningPackage cmdlet is supported on Windows 11 client operating system only.\r\n}",
                            "@{Text=You can use this cmdlet to install a .ppkg file interactively or silently by specifying the -QuietInstall switch parameter.\r\n}",
                            "@{Text=The default is an interactive install.}"
                        ],
          */
            const newSuggestions = result.data.output.map(
              (suggestion: PowerShellCommand) => {
                if (suggestion.Description !== undefined) {
                  const description = suggestion.Description[0].split("=")[1];
                  suggestion.Description = description.substring(
                    0,
                    description.length - 3
                  );
                  // Make the description be a limit of 100 characters
                  suggestion.Description = suggestion.Description.substring(
                    0,
                    100
                  );
                  // Add ... if the description is longer than 100 characters
                  if (suggestion.Description.length === 100) {
                    suggestion.Description += "...";
                  }
                }

                return suggestion;
              }
            );
            setSuggestions(newSuggestions);
          });
        };
        get_data();
      }
    }, 1000); // Wait for 1 second (you can adjust the delay as needed)

    // Clean up the timer on unmount (optional)
    return () => clearTimeout(debounceTimer);
  }, [command]);

  const currentTabData = getTab(currentTab) as TerminalTab;

  return (
    <div className="w-6/6 h-full">
      <div className="rounded-lg p-4 shadow-md mt-4 dark:bg-dark-bg-secondary text-white">
        <div className="flex items-center text-sky-400">
          <div className="flex flex-row items-center justify-evenly gap-x-4">
            {terminalTabs.map((terminalTab) => (
              <button
                key={terminalTab.name}
                className={`${
                  currentTab === terminalTab.name
                    ? "border border-sky-400"
                    : "bg-transparent"
                } py-2 px-4 hover:border-sky-400 rounded-sm`}
                onClick={() => changeTab(terminalTab.name)}
              >
                {terminalTab.name}
              </button>
            ))}
            <button
              className="py-2 px-4 rounded-sm border border-sky-500"
              onClick={addTab}
            >
              <span className="flex flex-row items-center justify-between">
                <FaPlus className="mr-2" />
                Add Tab
              </span>
            </button>
          </div>

          <div className="ml-auto relative">
            <select
              className="bg-transparent border border-sky-400 text-sky-400 p-2 rounded-sm"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="Powershell">Powershell</option>
              <option value="Python">Python</option>
            </select>
          </div>
        </div>

        <div className="p-4 overflow-y-auto w-full">
          <div className="w-full">
            {/* Fixed width container */}
            <pre className="flex flex-col gap-y-2 overflow-x-auto">
              <div>
                SafeLink [Version 1.0.0] (c) 2023 SafeLink Corporation. All
                rights reserved.
              </div>

              {currentTabData.commands.map((command, index) => (
                <CommandBlock
                  command={command}
                  key={index}
                  currentDirectory={currentDirectory}
                  error={currentTabData.responses[index].error}
                  response={currentTabData.responses[index]?.result}
                />
              ))}
            </pre>
          </div>
          <div className="flex flex-col gap-y-2 mt-8">
            <span className="text-sky-400 mt-4">{currentTab}</span>
            <textarea
              className="bg-transparent focus:outline-none dark:text-white rounded-sm"
              value={command}
              onChange={(e) => {
                setCommand(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  executeCommand();
                }
              }}
            />

            {/* Add suggestions */}
            <div className="flex flex-col gap-y-2 mt-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.Name}
                  className="bg-gray-800 text-white p-2 rounded-sm cursor-pointer hover:bg-blue-600 hover:text-white"
                  onClick={() => setCommand(suggestion.Name)}
                >
                  <div className="text-blue-400 font-semibold text-sm">
                    {suggestion.Source}
                  </div>
                  <div className="text-lg">{suggestion.Name}</div>
                  <div className="text-gray-400">{suggestion.Description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

{
  /*<div
                  key={index}
                  className="flex flex-col gap-y-2 border-t-2 border-b-2 border-gray-500 p-2 hover:bg-gray-900 transition-all duration-300"
                  
                >
                  <span className="text-sm text-gray-300 w-full">
                    {currentDirectory}
                  </span>
                  <span className="font-semibold">{command}</span>

                  <span
                    className={`${
                      currentTabData.responses[index].error && "text-red-600"
                    } ${
                      !currentTabData.responses[index].error && "text-white"
                    }`}
                  >
                    {currentTabData.responses[index].result}
                  </span>
                </div>*/
}

export default Terminal;
