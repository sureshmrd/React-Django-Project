// // import { Bar } from 'react-chartjs-2';
// // import { Chart,LinearScale,CategoryScale,BarElement } from 'chart.js';

// // Chart.register(
// //   LinearScale,CategoryScale,BarElement
// // )

// // const StudentBarPlot = ({ studentData }) => {
  
// //   console.log("in studentBarPlot page...")
// //   //console.log(studentData);

 
// //   const groupedByYear = studentData.reduce((acc, student) => {
// //     const year = student.year;
// //     const section = student.section;
// //     // console.log(year)
// //     // console.log(section)
// //     if (!acc[year]) {
// //       acc[year] = {};
// //     }
// //     if (!acc[year][section]) {
// //       acc[year][section] = 0;
// //     }
// //     acc[year][section] += student.backlogs;

// //     return acc;
// //   }, {});
// //   console.log(groupedByYear);
// //   console.log(Object.keys(groupedByYear));
     
// //   const years = Object.keys(groupedByYear);
// //   const sections = Object.keys(groupedByYear[years[0]]);

// //   const data = {
// //     labels: years,
// //     datasets: sections.map(section => ({
// //       label: section,
// //       backgroundColor: getRandomColor(),
// //       data: years.map(year => groupedByYear[year][section] || 0)
// //     }))
// //   };
  
// //   // const options = {
// //   //   scales: {
// //   //     xAxes: [{
// //   //       type: 'category', // Use category scale for the x-axis
// //   //       scaleLabel: {
// //   //         display: true,
// //   //         labelString: 'Year'
// //   //       }
// //   //     }],
// //   //     yAxes: [{
// //   //       scaleLabel: {
// //   //         display: true,
// //   //         labelString: 'Number of Backlogs'
// //   //       }
// //   //     }]
// //   //   }
// //   // };





// //   return (
// //     <div>
// //       return <Bar data={data}  />
// //     </div>
// //   );
  
// // };

// // function getRandomColor() {
// //   return '#' + Math.floor(Math.random() * 16777215).toString(16);
// // }
// // export default StudentBarPlot;



import { Bar } from 'react-chartjs-2';
import { Chart,LinearScale,CategoryScale,BarElement } from 'chart.js';

Chart.register(
  LinearScale,CategoryScale,BarElement
)

const StudentBarPlot = ({ studentData }) => {
  
  console.log("in studentBarPlot page...")
  //console.log(studentData);
  // Group students by year
  const groupedByYear = studentData.reduce((acc, student) => {
    if (!acc[student.year]) {
      acc[student.year] = {};
    }
    if (!acc[student.year][student.section]) {
      acc[student.year][student.section] = [];
    }
    acc[student.year][student.section].push(student);
    return acc;
  }, {});
  
  console.log(Object.keys(groupedByYear));

  const data = {
    labels: ['I', 'II', 'III', 'IV'], // Years
    datasets: Object.keys(groupedByYear).map(year => ({
      label: year,
      backgroundColor: getRandomColor(),
      data: Object.keys(groupedByYear[year]).map(section => {
        const totalBacklogs = groupedByYear[year][section].reduce((sum, student) => sum + student.backlogs, 0);
        return totalBacklogs;
      }),
    })),
  };
  
  const options = {
    scales: {
      xAxes: [{
        type: 'category', // Use category scale for the x-axis
        scaleLabel: {
          display: true,
          labelString: 'Year'
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Number of Backlogs'
        }
      }]
    }
  };





  return (
    <div>
      return <Bar data={data} options={options} />
    </div>
  );
  
};

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
export default StudentBarPlot;