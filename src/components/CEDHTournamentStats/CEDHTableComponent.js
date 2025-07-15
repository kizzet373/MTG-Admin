import React from "react";

const CEDHTableComponent = ({ columns, data, loading, getTableProps, getTableBodyProps, headerGroups, rows, prepareRow }) => {
  return (
    <div className="cedh-table-wrapper">
      <table {...getTableProps()} className="cedh-table">
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key: headerGroupKey, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr {...restHeaderGroupProps} key={headerGroupKey}>
                {headerGroup.headers.map((column) => {
                  const { key: columnKey, ...restColumnProps } = column.getHeaderProps(column.getSortByToggleProps());
                  const sortClass = column.isSorted ? (column.isSortedDesc ? "desc" : "asc") : "";
                  const columnClass = column.className || ""; // Get className from column definition
                  return (
                    <th {...restColumnProps} key={columnKey} className={`${sortClass} ${columnClass}`}>
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                Loading tournament stats...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                No data available for the selected filters.
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              prepareRow(row);
              const { key: rowKey, ...restRowProps } = row.getRowProps();
              return (
                <tr {...restRowProps} key={rowKey}>
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...restCellProps } = cell.getCellProps();
                    const columnClass = cell.column.className || ""; // Get className from column definition
                    return (
                      <td {...restCellProps} key={cellKey} className={columnClass}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CEDHTableComponent;
