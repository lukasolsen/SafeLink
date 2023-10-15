import React, { useEffect } from "react";
import { useTable } from "react-table";
import { getVictims } from "../service/api.service";

const Clients: React.FC = () => {
  const [victims, setVictims] = React.useState<Victims[]>([]);

  // Use memo to avoid re-rendering unless the data changes
  const data = React.useMemo(() => victims, [victims]);

  useEffect(() => {
    const fetchVictims = async () => {
      try {
        const response = await getVictims();
        setVictims(response.data.clients);
        console.log(response.data.clients);
      } catch (error) {
        console.error("Error fetching victims:", error);
      }
    };

    fetchVictims();
  }, []); // Add an empty dependency array to trigger the effect only once

  // Define table columns
  const columns = React.useMemo(
    () => [
      {
        Header: "Client Name",
        accessor: "computer_name",
      },
      {
        Header: "IP Address",
        accessor: "ip",
      },
      {
        Header: "Active",
        accessor: "status",
        Cell: ({ row }: any) => (
          <span
            className={`${
              row.values.status === "Online" ? "text-green-500" : "text-sky-500"
            }`}
          >
            {row.values.status}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "id",
        Cell: ({ row }: any) => (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={(e) => {
              console.log(row);
              e.preventDefault();
              if (row && row.values.id) {
                window.location.href = `/dashboard/client/${row.values.id}`;
              }
            }}
          >
            View
          </button>
        ),
      },
    ],
    []
  );

  console.log(victims);

  // Create a table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }); // Provide the 'data' prop

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-4">
          Clients
        </h2>

        {/* React Table */}
        {victims.length !== 0 && (
          <table {...getTableProps()} className="w-full">
            <thead>
              {headerGroups.map((headerGroup: any) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any) => (
                    <th {...column.getHeaderProps()} className="text-left">
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row: any) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell: any) => {
                      return (
                        <td {...cell.getCellProps()} className="py-2">
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Show a message if there are no victims */}
        {victims.length === 0 && (
          <p className="text-center text-gray-400">No victims found.</p>
        )}
      </div>
    </div>
  );
};

export default Clients;
