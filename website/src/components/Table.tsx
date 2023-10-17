/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import {
  useGlobalFilter,
  useSortBy,
  useTable,
  Column,
  Cell,
  Row,
} from "react-table";

type DataTableProps = {
  data: any[];
  columns: Column<any>[];
  setSelectedData: React.Dispatch<React.SetStateAction<any | undefined>>;
  renderData: (cell: Cell, row: Row<object>) => JSX.Element;
};

const Table: React.FC<DataTableProps> = ({
  data,
  columns,
  setSelectedData,
  renderData,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useGlobalFilter,
      useSortBy
    );

  return (
    <table {...getTableProps()} className="w-full table-fixed">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            className="text-sky-400 select-none"
          >
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className="p-2 text-left"
              >
                <div className="flex items-center">
                  {column.render("Header")}
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <FiArrowDown className="text-sky-400" />
                    ) : (
                      <FiArrowUp className="text-sky-400" />
                    )
                  ) : null}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              className="p-2 rounded-md mb-2 hover:text-white"
            >
              {row.cells.map((cell) => {
                //Render extra data if the user wants to
                // we want to render data, however if the cell is never toched we want to render the default

                if (renderData) {
                  return renderData(cell, row);
                }

                return (
                  <td
                    {...cell.getCellProps()}
                    className="p-2 border-b border-gray-700"
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
