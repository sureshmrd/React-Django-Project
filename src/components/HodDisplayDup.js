import React, { useEffect, useState } from "react";
import axios from "axios";

const HodDisplay = ({ username }) => {
  const [data, setData] = useState([]);
  

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/myapi/counsellorsList/",
          {
            // If any request body is required, you can provide it here
          }
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.log(error)
      }
    };

    fetchCounsellors();
  }, []);

  return (
    <div>
      {data.map((data, index) => (
        <div key={index}>
          <h2>{data.counsellor.counId} - {data.counsellor.name}</h2>
          <ul>
            {data.students.map((student, studentIndex) => (
              <li key={studentIndex}>
                {student.regNo} - CGPA: {student.cgpa} - Backlogs: {student.backlogs}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default HodDisplay;
