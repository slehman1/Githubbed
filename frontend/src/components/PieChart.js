import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {Col} from "react-bootstrap"

ChartJS.register(ArcElement, Tooltip, Legend);



function PieChart(props) {

  //
  const styler = {
    width: "300px",
    height: "300px",
    
  }

  const styler2 = {
    display: props.display
  }
  

  function onDragStart(event) {
    event
      .dataTransfer
      .setData('text/plain', event.target.id);
  }

  // const prebuiltBGColors = [
  //   'rgba(255, 99, 132, 0.2)',
  //   'rgba(54, 162, 235, 0.2)',
  //   'rgba(255, 206, 86, 0.2)',
  //   'rgba(75, 192, 192, 0.2)',
  //   'rgba(153, 102, 255, 0.2)',
  //   'rgba(255, 159, 64, 0.2)',
  // ]
  // const prebuiltBorderColors = [
  //   'rgba(255, 99, 132, 1)',
  //   'rgba(54, 162, 235, 1)',
  //   'rgba(255, 206, 86, 1)',
  //   'rgba(75, 192, 192, 1)',
  //   'rgba(153, 102, 255, 1)',
  //   'rgba(255, 159, 64, 1)',
  // ]

  const difColors = ["#90FB92","#0076FF","#D5FF00","#FF937E","#6A826C","#FF029D","#FE8900","#7A4782","#7E2DD2","#85A900","#FF0056","#A42400","#00AE7E","#683D3B","#BDC6FF","#263400","#BDD393","#00B917","#9E008E","#001544","#C28C9F","#FF74A3","#01D0FF","#004754","#E56FFE","#788231","#0E4CA1","#91D0CB","#BE9970","#968AE8","#BB8800","#43002C","#DEFF74","#00FFC6","#FFE502","#620E00","#008F9C","#98FF52","#7544B1","#B500FF","#00FF78","#FF6E41","#005F39","#6B6882","#5FAD4E","#A75740","#A5FFD2","#FFB167","#009BFF","#E85EBE"]
  const colorsWithOpacity = difColors.map(color => color + "20")

    const languageColorDict = {
      "Python": ["#00FF0020", "#00FF00"],
      "JavaScript": ["#0000FF20", "#0000FF20"],
      "HTML": ["#FF000020", "#FF0000"],
      "CSS": ["#01FFFE20", "#01FFFE"],
      "TypeScript": ["#FFA6FE20", "#FFA6FE"],
      "SCSS": ["#FFDB6620", "#FFDB66"],
      "PHP": ["#00640120", "#006401"],
      "Hack": ["#00640120", "#006401",],
      "Jupyter Notebook": ["#01006720", "#010067"],
      "Makefile": ["#007DB520", "#007DB5"],
      "OCaml": ["#FF00F620", "#FF00F6"],
      "Shell": ["#FFEEE820", "#FFEEE8"],
      "Procfile": ["#774D0020", "#774D00"]
  
    }
  

    const labels = []
    const dataz = []
    const newBGColors = []
    const newBorderColors = []
    var z = -1;
    for (var key in props.languages){
      labels.push(key)
      dataz.push(props.languages[key])
      if (key in languageColorDict){
        newBGColors.push(languageColorDict[key][0])
        newBorderColors.push(languageColorDict[key][1])
      } else {
        z += 1
        newBGColors.push(colorsWithOpacity[z])
        newBorderColors.push(difColors[z])


      }
    }
    
    const data = {
        labels: labels,
        datasets: [
          {
            label: '# of Bytes',
            data: dataz,
            backgroundColor: newBGColors,
            borderColor: newBorderColors,
            borderWidth: 1,
          },
        ],
    };
  return (
  <Col  id='pie-chart'  style={props.limitSize ? styler : styler2} draggable={true} onDragStart={(e) => onDragStart(e)}>
  {props.displayUser ? <h3>{props.user}</h3> : null}
  <Pie data={data}/>
  </Col>
  );
}

export default PieChart;