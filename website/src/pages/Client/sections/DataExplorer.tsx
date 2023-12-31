import React, { useState } from "react";
import {
  FiDatabase,
  FiFile,
  FiSearch,
  FiArrowLeft,
  FiGlobe,
} from "react-icons/fi";
import JSONViewer from "./DataExplorer/Json-Viewer";
import Table from "../../../components/Table";
import { Cell, Row } from "react-table";

const Categories = {
  Browsers: {
    name: "Browsers",
    icon: <FiGlobe className="mr-2" />,
    color: "blue-600",
  },
  "Windows Defender": {
    name: "Windows Defender",
    icon: <FiGlobe className="mr-2" />,
    color: "purple-600",
  },
};

type Data = {
  id: number;
  type: string;
  name: string;
  content: string | object;
  lastUpdated: string;
  category?: keyof typeof Categories;
};

const DataExplorer: React.FC = () => {
  const [selectedData, setSelectedData] = useState<Data>(); // Store selected data
  const [searchQuery, setSearchQuery] = useState(""); // Store search query

  const data: Data[] = [
    {
      id: 1,
      type: "Database",
      name: "Database A",
      content: "Sample database content...",
      lastUpdated: "2023-03-15",
      category: "Browsers",
    },
    {
      id: 2,
      type: "JSON",
      name: "Data File 1",
      content: {
        comments: [
          {
            id: 1,
            body: "This is some awesome thinking!",
            postId: 100,
            user: {
              id: 63,
              username: "eburras1q",
            },
          },
          {
            id: 2,
            body: "What terrific math skills you’re showing!",
            postId: 27,
            user: {
              id: 71,
              username: "omarsland1y",
            },
          },
          // 30 items
        ],
        total: 340,
        skip: 0,
        limit: 30,
      },
      lastUpdated: "2023-03-14",
      category: "Browsers",
    },
    // Add more data items
  ];

  const renderData = (cell: Cell, row: Row<object>) => {
    if (cell.column.id === "name") {
      return (
        <td
          {...cell.getCellProps()}
          className={`border-b border-gray-700 rounded-md hover:text-sky-500 cursor-pointer`}
          onClick={() => setSelectedData(row.original)}
        >
          <div className="flex items-center">
            {cell.row.original.type === "Database" ? (
              <FiDatabase className="mr-2" />
            ) : (
              <FiFile className="mr-2" />
            )}
            {cell.value}
          </div>
        </td>
      );
    }
    if (cell.column.id === "category") {
      return (
        <td
          {...cell.getCellProps()}
          className="p-2 border-b border-gray-700 rounded-md"
        >
          <div className={`flex items-center text-white rounded-md`}>
            <span className={`text-${Categories[cell.value].color}`}>
              {Categories[cell.value].icon}
            </span>
            {Categories[cell.value].name}
          </div>
        </td>
      );
    }

    return (
      <td
        {...cell.getCellProps()}
        className="p-2 border-b border-gray-700 rounded-md"
      >
        {cell.render("Cell")}
      </td>
    );
  };

  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Category",
      accessor: "category",
    },
    {
      Header: "Last Updated",
      accessor: "lastUpdated",
    },
  ];

  return (
    <div className="dark:bg-dark-bg-secondary p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-lg text-sky-400 flex items-center">
        {selectedData ? (
          <div className="flex items-center justify-between w-6/12">
            <button
              onClick={() => setSelectedData(undefined)}
              className="text-sky-400 hover:text-white p-2"
            >
              <div className="flex items-center">
                <FiArrowLeft className="mr-2" />
                Back
              </div>
            </button>
            <h3 className="text-lg text-sky-400 mb-2 flex items-center">
              {selectedData.type === "Database" ? (
                <FiDatabase className="mr-2" />
              ) : (
                <FiFile className="mr-2" />
              )}
              {selectedData.name}
            </h3>
          </div>
        ) : (
          <>
            <FiDatabase className="mr-2" />
            Data Explorer
          </>
        )}
      </h2>
      {selectedData ? (
        <div>
          {selectedData.type === "JSON" && <JSONViewer data={selectedData} />}
        </div>
      ) : (
        <div className="mt-4">
          <div className="bg-gray-900 p-2 rounded-lg relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search data..."
              className="w-full bg-transparent text-white focus:outline-none"
            />
            <FiSearch className="absolute text-gray-400 top-3 right-3" />
          </div>
          <div className="bg-gray-800 p-4 mt-4 rounded-lg h-96 overflow-y-auto">
            <Table
              data={data.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              columns={columns}
              renderData={renderData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataExplorer;
