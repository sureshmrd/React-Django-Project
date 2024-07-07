import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentBarPlot from './StudentBarPlot'; 

const HodDisplay = ({ username }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [combineData,setCombineData]=useState([]);
  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/myapi/counsellorsList/",
          {
            // If any request body is required, you can provide it here
          }
        );
        // console.log(response.data);
        setData(response.data);
        
        let combinedArray = [];
        

for (let i = 0; i < response.data.length; i++) {
  combinedArray = combinedArray.concat(response.data[i].students);
}

setCombineData(combinedArray);

        console.log(response.data);
      } catch (error) {
        console.log(error)
      }
    };

    fetchCounsellors();
  }, []);


  console.log({combineData}.combineData);

   // Group students by year
   const groupedByYear = combineData.reduce((acc, student) => {
    if (!acc[student.year]) {
      acc[student.year] = {};
    }
    if (!acc[student.year][student.section]) {
      acc[student.year][student.section] = [];
    }
    acc[student.year][student.section].push(student);
    return acc;
  }, {});

console.log(groupedByYear);
//grouped the total students based on year - section 




  return (
    <div>
    <div>
      <h2>SECTION - 1</h2>
      {data.map((data, index) => (
        <div key={index}>
          <h2 onClick={() => navigate(`/counsellor/${data.counsellor.counId}`)}>{data.counsellor.counId} - {data.counsellor.name}</h2>
        </div>
      ))}
    </div>
    <div>
          <h2>SECTION - 2</h2>

      <StudentBarPlot studentData={combineData}/>

    </div>
    </div>
  );
};

export default HodDisplay;


//student data is not enough to 