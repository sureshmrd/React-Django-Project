import React, { useState } from "react";

const RandomTable = () => {
  const data = [
    { a: 1, b: 1 },
    { a: 2, b: 1 },
    { a: 3, b: 2 },
    { a: 4, b: 2 },
    { a: 5, b: 1 },
    { a: 6, b: 3 },
    { a: 7, b: 3 },
    { a: 8, b: 2 },
    { a: 9, b: 4 },
  ];

  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRowExpand = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
    console.log(expandedRows)
  };

  const renderRow = (row, index) => {
    const group = data.filter((rowData) => rowData.b === row.b);
    const showExpandButton = group.length > 1;
  
    if (expandedRows.includes(index)) {
      // If the row is expanded, display the entire group
      return group.map((groupRow, groupIndex) => (
        <tr key={groupIndex}>
          <td>{groupRow.a}</td>
          <td>{groupRow.b}</td>
          <td>
            {groupIndex === 0 && ( // Show collapse button only for the first row of the group
              <button
                className="btn btn-sm btn-primary"
                onClick={() => toggleRowExpand(index)}
              >
                {expandedRows.includes(index) ? "Collapse" : "Expand"}
              </button>
            )}
          </td>
        </tr>
      ));
    } else {
      // Otherwise, display only the individual row
      return (
        <tr key={index}>
          <td>{row.a}</td>
          <td>{row.b}</td>
          <td>
            {showExpandButton && (
              <button
                className="btn btn-sm btn-primary"
                onClick={() => toggleRowExpand(index)}
              >
                {expandedRows.includes(index) ? "Collapse" : "Expand"}
              </button>
            )}
          </td>
        </tr>
      );
    }
  };
  

  const renderRows = () => {
    const uniqueBValues = Array.from(new Set(data.map((row) => row.b)));
    return uniqueBValues.map((bValue) => {
      const group = data.filter((row) => row.b === bValue);
      const firstRowIndex = data.findIndex((row) => row.b === bValue);
      return renderRow(group[0], firstRowIndex);
    });
  };

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>A</th>
          <th>B</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {renderRows()}
      </tbody>
    </table>
  );
};

export default RandomTable;
