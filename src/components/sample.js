import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const RandomTable = () => {
  const [studentData, setStudentData] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order for date
  const { regNo } = useParams();
  const [selectedSem, setSelectedSem] = useState("all");
  const [expandedRows, setExpandedRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/myapi/students/`,
          {
            params: { regNo },
          }
        );
        const data = [
          {
            credits: "0.0",
            grade: "F",
            id: 18468,
            internals: "10",
            month_year: "2022-02-01",
            regNo: "19B81A0127",
            sem: "II B.TECH I Sem",
            subCode: "R1921011",
            subName: "COMPLEX VARIABLES AND STATISTICAL METHOD"
          },
          {
            credits: "0.0",
            grade: "F",
            id: 18469,
            internals: "12",
            month_year: "2022-02-01",
            regNo: "19B81A0127",
            sem: "II B.TECH I Sem",
            subCode: "R1921011",
            subName: "STRENGTH OF MATERIALS-I"
          },
          {
            credits: "0.0",
            grade: "F",
            id: 18470,
            internals: "10",
            month_year: "2022-02-01",
            regNo: "19B81A0127",
            sem: "II B.TECH I Sem",
            subCode: "R1921013",
            subName: "FLUID MECHANICS"
          },
          {
            credits: "0.0",
            grade: "F",
            id: 18471,
            internals: "13",
            month_year: "2022-02-01",
            regNo: "19B81A0127",
            sem: "II B.TECH I Sem",
            subCode: "R1921014",
            subName: "SURVEYING AND GEOMETRICS"
          },
          {
            credits: "0.8",
            grade: "F",
            id: 18472,
            internals: "13",
            month_year: "2022-02-01",
            regNo: "19B81A0127",
            sem: "II B.TECH I Sem",
            subCode: "R1921016",
            subName: "TRANSPORTATION ENGINEERING-I"
          }
        ];
        
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchData();
  }, [regNo]);

  const handleSemSelect = (e) => {
    setSelectedSem(e.target.value);
  };

  const toggleRowExpand = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

  if (studentData === null) {
    return <p>Loading...</p>;
  }

  // Function to toggle sorting order for Date column
  const toggleDateSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setStudentData(
      [...studentData].sort((a, b) => {
        const dateA = new Date(a.month_year);
        const dateB = new Date(b.month_year);
        return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
      })
    );
  };

  const renderRows = () => {
    const uniqueSubCodeValues = Array.from(new Set(studentData.map((row) => row.subCode)));
    return uniqueSubCodeValues.map((subCodeValue, index) => {
      const group = studentData.filter((row) => row.subCode === subCodeValue);
      const firstRow = group[0]; // Get the first row of the group
      return (
        <React.Fragment key={index}>
          <tr>
            <td>{firstRow.regNo}</td>
            <td>
              {expandedRows.includes(index) ? (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => toggleRowExpand(index)}
                >
                  Collapse
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => toggleRowExpand(index)}
                >
                  Expand
                </button>
              )}
              {firstRow.subCode}
            </td>
            <td>{firstRow.subName}</td>
            <td>{firstRow.internals}</td>
            <td>{firstRow.grade}</td>
            <td>{firstRow.credits}</td>
            <td>{firstRow.sem}</td>
            <td>{firstRow.month_year}</td>
          </tr>
          {expandedRows.includes(index) &&
            group.slice(1).map((subResult, subIndex) => (
              <tr key={`${index}-${subIndex}`} className="bg-light">
                <td>{subResult.regNo}</td>
                <td>{subResult.subCode}</td>
                <td>{subResult.subName}</td>
                <td>{subResult.internals}</td>
                <td>{subResult.grade}</td>
                <td>{subResult.credits}</td>
                <td>{subResult.sem}</td>
                <td>{subResult.month_year}</td>
              </tr>
            ))}
        </React.Fragment>
      );
    });
  };

  return (
    <div>
      <h1>Student Data</h1>
      <div>
        <h2>Results</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="w-10">Reg No</th>
              <th className="w-10">Sub Code</th>
              <th className="w-10">Sub Name</th>
              <th className="w-10">Internals</th>
              <th className="w-10">Grade</th>
              <th className="w-10">Credits</th>
              <th className="w-20">
                <div className="d-flex align-items-center justify-content-between">
                  <span>Sem</span>
                  <div className="dropdown">
                    <select
                      className="form-select"
                      value={selectedSem}
                      onChange={handleSemSelect}
                    >
                      <option value="all">All</option>
                      <option value="I B.TECH I Sem">1-1</option>
                      <option value="I B.TECH II Sem">1-2</option>
                      <option value="II B.TECH I Sem">2-1</option>
                      <option value="II B.TECH II Sem">2-2</option>
                      <option value="III B.TECH I Sem">3-1</option>
                      <option value="III B.TECH II Sem">3-2</option>
                      <option value="IV B.TECH I Sem">4-1</option>
                      <option value="IV B.TECH II Sem">4-2</option>
                    </select>
                  </div>
                </div>
              </th>
              <th
                className="w-20"
                onClick={toggleDateSortOrder}
                style={{ cursor: "pointer" }}
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {renderRows()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RandomTable;

function mapping(grade) {
  switch (grade) {
      case 'F':
      case 'ABSENT':
      case 'MP':
          return -1;
      case 'A+':
          return 10;
      case 'A':
          return 9;
      case 'B':
          return 8;
      case 'C':
          return 7;
      case 'D':
          return 6;
      case 'E':
          return 5;
      case 'COMPLE':
          return 0;
      default:
          return 0;
  }
}

// Function to calculate CGPA
function calculateCGPA(data) {
  var totalCredits = 0;
  var totalGradePoints = 0;

  data.forEach(function(record) {
      var grade = mapping(record.grade);
      if (grade >= 0) { // Exclude grades mapped to -1
          var credits = parseFloat(record.credits);
          totalCredits += credits;
          totalGradePoints += grade * credits;
      }
  });

  // Avoid division by zero
  if (totalCredits === 0) {
      return 0;
  }

  return totalGradePoints / totalCredits;
}
