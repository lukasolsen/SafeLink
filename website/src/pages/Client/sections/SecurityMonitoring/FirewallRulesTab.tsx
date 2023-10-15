import React, { useMemo } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { FiEdit, FiTrash } from "react-icons/fi";

// Sample data for firewall rules (you can fetch this data from an API)
const firewallRules = [
  {
    id: 1,
    name: "Rule 1",
    priority: 1,
    action: "Allow",
    protocol: "TCP",
    source: "",
    destination: "",
  },
  // Add more rules as needed
];

const FirewallRulesTable: React.FC = () => {
  const data = useMemo(() => firewallRules, []);
  const columns = useMemo(
    () => [
      {
        Header: "Rule Name",
        accessor: "name",
      },
      {
        Header: "Priority",
        accessor: "priority",
      },
      {
        Header: "Action",
        accessor: "action",
      },
      {
        Header: "Protocol",
        accessor: "protocol",
      },
      {
        Header: "Source",
        accessor: "source",
      },
      {
        Header: "Destination",
        accessor: "destination",
      },
      {
        accessor: "edit",
        Cell: ({ value }) => (
          <button className="text-blue-500 hover:underline">
            <FiEdit />
          </button>
        ),
      },
      {
        accessor: "trash",
        Cell: ({ value }) => (
          <button className="text-red-500 hover:underline">
            <FiTrash />
          </button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10 }, // Set the initial page size
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Firewall Rules</h2>
      <table {...getTableProps()} className="min-w-full mt-4">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="border-b">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="p-2 text-left font-semibold"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} className="p-2 border-b">
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <div>
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="text-gray-600"
          >
            {"<<"}
          </button>{" "}
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="text-gray-600"
          >
            {"<"}
          </button>{" "}
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="text-gray-600"
          >
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="text-gray-600"
          >
            {">>"}
          </button>{" "}
        </div>
        <div className="text-gray-600">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "50px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default FirewallRulesTable;
