import React from "react"
import PieChart from "./PieChart";




function Profile(props){
    const data = props.data

    function onDragStart(event) {
        event
          .dataTransfer
          .setData('text/plain', event.target.id);
      }

    const newDate = data.total.createdAt.split("T")[0]

    return (
        <div id="profile-info" draggable={true} onDragStart={(e) => onDragStart(e)} style={{borderStyle: "solid", textAlign: "center", borderRadius: "10px", display: props.display}} className="card-div">
            <h2>Profile</h2>
            <h5>Bio: {data.total.bio || "Inorganic"}</h5>
            <h5>User Since: {newDate}</h5>
            <h5>Company: {data.total.company || "Freebird"}</h5>
            <h5>Location: {data.total.location || "Hiding"}</h5>

           
        </div>
    )
}

export default Profile;