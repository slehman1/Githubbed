import React from "react"
import PieChart from "./PieChart";




function Card(props){
    return (
        <div className="card-div">
            <h3>{props.user}</h3>
            <p>Public Repos: {props.repos}</p>
            <p>Total Bytes: {props.bytes}</p>
            <p>Total Open Issues: {props.issues}</p>
            <PieChart languages={props.languageDict} />
        </div>
    )
}

export default Card;