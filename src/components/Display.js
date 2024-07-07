import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Display component to show student data
export const Display = () => {
  const [studentData, setStudentData] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const { regNo } = useParams();
  const [selectedSem, setSelectedSem] = useState("all");
  const [cgpaAndBacklogs, setCgpaAndBacklogs] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/myapi/students/`,
          {
            params: { regNo },
          }
        );
        const data = response.data;
        console.log(data);
        const cgpaAndBacklogs = calculateCGPAAndBacklogs(data);
        setCgpaAndBacklogs(cgpaAndBacklogs);
        setStudentData(data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchData();
  }, [regNo]);

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

  const handleSemSelect = (e) => {
    setSelectedSem(e.target.value);
  };

  if (studentData === null || cgpaAndBacklogs === null) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Results</h2>
      <div className="align-items-center mb-3">
        <div className="d-flex justify-content-end me-2 ">
          CGPA: {cgpaAndBacklogs.cgpa.toFixed(2)}
        </div>
        <div className="d-flex justify-content-end me-2 ">
          Backlogs: {cgpaAndBacklogs.backlogs}
        </div>
      </div>
      <div>
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
                  <span >Sem</span>
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
            {studentData
              .filter((result) => {
                if (selectedSem === "all") {
                  return true;
                } else {
                  return result.sem === selectedSem;
                }
              })
              .map((result, index) => (
                <tr key={index}>
                  <td>{result.regNo}</td>
                  <td>{result.subCode}</td>
                  <td>{result.subName}</td>
                  <td>{result.internals}</td>
                  <td>{result.grade}</td>
                  <td>{result.credits}</td>
                  <td>{result.sem}</td>
                  <td>{result.month_year}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

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

function keepLatestResults(data) {
  var latestResults = {};
  data.forEach(function(record) {
      var subCode = record.subCode;
      if (!latestResults[subCode] || record.month_year > latestResults[subCode].month_year) {
          latestResults[subCode] = record;
      }
  });
  return Object.values(latestResults);
}

// Function to calculate CGPA
function calculateCGPAAndBacklogs(data) {
  data = keepLatestResults(data);
  var totalCredits = 0;
  var totalGradePoints = 0;
  var backlogs = 0;

  data.forEach(function(record) {
      var grade = mapping(record.grade);
      var credits = parseFloat(record.credits);
      if (grade >= 0) { // Exclude grades mapped to -1
          totalCredits += credits;
          totalGradePoints += grade * credits;
      } else {
          backlogs++;
      }
  });

  // Avoid division by zero
  if (totalCredits === 0) {
      return { cgpa: 0, backlogs: backlogs };
  }

  var cgpa = totalGradePoints / totalCredits;

  return { cgpa: cgpa, backlogs: backlogs };
}