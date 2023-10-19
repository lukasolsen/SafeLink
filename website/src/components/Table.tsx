/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import {
  useTable,
  Column,
  Cell,
  Row,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

type DataTableProps = {
  data: any[];
  columns: Column<any>[];
  renderData: (cell: Cell, row: Row<object>, key?: number) => JSX.Element;
  renderFilters?: () => JSX.Element;
  curPage?: number;
  changePage?: React.Dispatch<React.SetStateAction<number>>;
  pagination?: boolean;
};

const Table: React.FC<DataTableProps> = ({
  data,
  columns,
  renderData,
  curPage,
  changePage,
  pagination,
  renderFilters,
}) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex, pageSize }, // Set initial state here
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    console.log("Changing page to", curPage);
    if (curPage !== undefined) {
      setPageIndex(curPage);
      changePage?.(curPage);
    }
  }, [data, curPage]);

  return (
    <>
      {renderFilters && renderFilters()}
      <table {...getTableProps()} className="w-full">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="text-sky-400 select-none"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="p-2 text-left"
                  key={column.id}
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
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="p-2 rounded-md mb-2 hover:text-white"
                key={row.original.id}
              >
                {row.cells.map((cell: Cell) => {
                  //Render extra data if the user wants to
                  // we want to render data, however if the cell is never toched we want to render the default

                  if (renderData) {
                    return renderData(cell, row, row.original.id);
                  }

                  return (
                    <td
                      {...cell.getCellProps()}
                      className="p-2 border-b border-gray-700"
                      key={cell.column.id}
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
      {/* Pagination */}
      {pagination && (
        <div className="container flex justify-between items-center gap-2 text-white p-2">
          <div>
            <span>
              {pageIndex * pageSize + 1}-{pageIndex * pageSize + page.length} of{" "}
              {data.length}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => {
                previousPage();
                if (changePage) {
                  changePage(pageIndex - 1);
                }
              }}
              disabled={!canPreviousPage}
              className={`${!canPreviousPage ? "disabled" : ""}`}
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={() => {
                gotoPage(0);
                if (changePage) {
                  changePage(0);
                }
              }}
              disabled={!canPreviousPage}
              className={`p-2 rounded-sm ${
                !canPreviousPage ? "disabled" : ""
              } ${pageIndex === 0 ? "bg-blue-600" : "hover:bg-blue-600"}`}
            >
              1
            </button>

            {/* Display 5 of the start pages such as 5 differnet buttons with the number 1, 2, 3 ,4 ,5. If some does not exist then dont include. If too many then just add another non-clickable button with ... */}

            {Array.from(
              { length: Math.min(Math.max(pageCount - 2, 0), 5) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    gotoPage(i + 1);
                    if (changePage) {
                      changePage(i + 1);
                    }
                  }}
                  className={`${
                    i + 1 === pageIndex ? "bg-blue-600" : "hover:bg-blue-600"
                  }`}
                >
                  {i + 2}
                </button>
              )
            )}

            {pageCount > 5 && <span>...</span>}

            {page.length !== data.length && (
              <button
                onClick={() => {
                  gotoPage(pageCount - 1);
                  if (changePage) {
                    changePage(pageCount - 1);
                  }
                }}
                disabled={!canNextPage}
                className={`${!canNextPage ? "disabled" : ""}`}
              >
                {pageCount}
              </button>
            )}
            <button
              onClick={() => {
                nextPage();
                if (changePage) {
                  changePage(pageIndex + 1);
                }
              }}
              disabled={!canNextPage}
              className={`${!canNextPage ? "disabled" : ""}`}
            >
              <FaChevronRight />
            </button>

            {/*<select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
            className="p-1 rounded-md dark:bg-dark-bg dark:text-white"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
            </select>*/}
          </div>
        </div>
      )}
    </>
  );
};

export default Table;
