import React from "react"
import PieChart from "./PieChart";




function Card(props){
    const data = props.data

    function onDragStart(event) {
        event
          .dataTransfer
          .setData('text/plain', event.target.id);
      }

    
    return (
        <div id="card" onDragStart={(e) => onDragStart(e)} draggable={true} style={{borderStyle: "solid", textAlign: "center", borderRadius: "10px", display: props.display}} className="card-div">
            {props.metrics && <h2>Metrics</h2>}
            <h5>Public Repos: {data.total.repoCount}</h5>
            <h5>Total Lines: {data.total.lines}</h5>
            <h5>Total PR's: {data.total.prs}</h5>
            <h5>Total Commits: {data.total.commits}</h5>
            <h5>Stars Earned: {data.total.stars}</h5>
            
            <h5>Total Open Issues: {data.total.openIssues}</h5>
            {props.displayPie && <PieChart languages={data.total.languageDict} />}
        </div>
    )
}

export default Card;