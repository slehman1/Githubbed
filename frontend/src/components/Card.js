import React from "react"
import PieChart from "./PieChart";




function Card(props){
    const data = props.data
    console.log(data)
    console.log("here")
    return (
        <div style={{borderStyle: "solid", textAlign: "center", borderRadius: "10px"}} className="card-div">
            {/* <h3>{data.total.user}</h3> */}
            <p>Public Repos: {data.total.repoCount}</p>
            <p>Total Lines: {data.total.lines}</p>
            <p>Total PR's: {data.total.prs}</p>
            <p>Total Commits: {data.total.commits}</p>
            <p>Stars Earned: {data.total.stars}</p>
            
            <p>Total Open Issues: {data.total.openIssues}</p>
            <PieChart languages={data.total.languageDict} />
        </div>
    )
}

export default Card;