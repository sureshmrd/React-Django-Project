import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Display component to show student data
export const CounsellorDisplay = () => {
  const [studentData, setStudentData] = useState([]);
  const [counsellor, setCounsellor] = useState([]);
  const [cgpaAndBacklogs, setCgpaAndBacklogs] = useState([]);
  const { counId } = useParams();
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState({ cgpa: 'asc', backlogs: 'asc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/myapi/counsellor/`,
          {
            params: { counId },
          }
        );
        setStudentData(response.data.students);
        console.log(response.data.students);
        const values = [];
        // Iterate over each student object in the array
        response.data.students.forEach(function (student) {
          // Access the regNo property of each student object
          console.log(student.results);
          const cgpaAndBacklogs = calculateCGPAAndBacklogs(student.results);
          values.push(cgpaAndBacklogs);
        });
        setCgpaAndBacklogs(values);
        setCounsellor(response.data.name);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchData();
  }, [counId]);

  if (studentData.length === 0) {
    return <p>Loading...</p>;
  }

  

  const toggleSortOrder = (column) => {
    setSortOrder({ ...sortOrder, [column]: sortOrder[column] === 'asc' ? 'desc' : 'asc' });

    const sortedCgpaAndBacklogs = [...cgpaAndBacklogs].sort((a, b) => {
      if (column === 'cgpa') {
        return sortOrder.cgpa === 'asc' ? a.cgpa - b.cgpa : b.cgpa - a.cgpa;
      } else if (column === 'backlogs') {
        return sortOrder.backlogs === 'asc' ? a.backlogs - b.backlogs : b.backlogs - a.backlogs;
      }
    });

    setCgpaAndBacklogs(sortedCgpaAndBacklogs);
  };

  return (
    <div>
      <h1>
        {counsellor} - <h3>Student List</h3>
      </h1>

      {/* <ul>
        {studentData.map((student, index) => (
          <div key={index}>
            <h3>{student.regNo}</h3>
            <h4>CGPA : {cgpaAndBacklogs[index].cgpa.toFixed(2)}</h4>
            <h4>Backlogs : {cgpaAndBacklogs[index].backlogs}</h4>
            <h5 onClick={()=>{
              navigate(`/student/${student.regNo}`)
            }}>see detailed view of - {student.regNo}</h5>
          </div>
        ))}
      </ul> */}
      <div className="align-items-center mb-3">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              
              <th style={{padding: "8px",textAlign: "left",border: "1px solid #ddd",}}>Reg-Number</th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                }}
                onClick={() => toggleSortOrder('cgpa')}
              >
                CGPA {sortOrder.cgpa === 'asc' ? '▲' : '▼'}
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                }}
                onClick={() => toggleSortOrder('backlogs')}
              >
                Backlogs  {sortOrder.backlogs === 'asc' ? '▲' : '▼'}
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  border: "1px solid #ddd",
                }}
              >
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((student, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                }}
              >
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {student.regNo}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {cgpaAndBacklogs[index].cgpa.toFixed(2)}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  {cgpaAndBacklogs[index].backlogs}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                  <button
                    style={{
                      padding: "6px 10px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/student/${student.regNo}`)}
                  >
                    See Detailed View
                  </button>
                </td>
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
    case "F":
    case "ABSENT":
    case "MP":
      return -1;
    case "A+":
      return 10;
    case "A":
      return 9;
    case "B":
      return 8;
    case "C":
      return 7;
    case "D":
      return 6;
    case "E":
      return 5;
    case "COMPLE":
      return 0;
    default:
      return 0;
  }
}

function keepLatestResults(data) {
  var latestResults = {};
  data.forEach(function (record) {
    var subCode = record.subCode;
    if (
      !latestResults[subCode] ||
      record.month_year > latestResults[subCode].month_year
    ) {
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

  data.forEach(function (record) {
    var grade = mapping(record.grade);
    var credits = parseFloat(record.credits);
    if (grade >= 0) {
      // Exclude grades mapped to -1
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