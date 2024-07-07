// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// // Display component to show student data
// export const CounsellorDisplay = () => {
//   const [studentData, setStudentData] = useState([]);
//   const [counsellor, setCounsellor] = useState([]);
//   const { counId } = useParams();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8000/myapi/counsellor/`, {
//           params: { counId },
//         });
//         console.log(response)
//         setStudentData(response.data.students);
//         setCounsellor(response.data.name);
//       } catch (error) {
//         console.error('Error fetching student data:', error);
//       }
//     };
//     fetchData();
//   }, [counId]);

//   if (studentData.length === 0) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div>
//       <h1>{counsellor}</h1>
//       <h2>Student List</h2>
//       <ul>
//         {studentData.map((student, index) => (
//           <div key={index}>
//             <h3>{student.regNo}</h3>
//             <ul>
//               {student.results.map((result, resultIndex) => (
//                 <li key={resultIndex}>
//                   {result.subCode} - {result.subName} - {result.internals} - {result.grade} - {result.credits} - {result.sem} - {result.month_year}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </ul>
//     </div>
//   );
// };


//-----------------------------------------------without table--------

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
  const navigate=useNavigate();

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
          const values=[];
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

  return (
    <div>
      <h1>{counsellor}</h1>
      <h2>Student List</h2>
      <ul>
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
      </ul>
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
