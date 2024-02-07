import React from "react"
import Table from 'react-bootstrap/Table';



function SingleTable(props){



    const data = props.data
    let foo;

    if (props.recent){
        foo = "recent"
    } else {
        foo = "total"

    }

    function onDragStart(event) {
        event
          .dataTransfer
          .setData('text/plain', event.target.id);
      }



   
    return (
        <div id={foo} onDragStart={(e) => onDragStart(e)} draggable={true} style={{borderStyle: "solid", textAlign: "center", borderRadius: "10px", display: props.display}} className="card-div">
        {props.recent ? <h2>3M Activity</h2> : <h2>Totals</h2>}
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Metrics</th>
                    <th>{data[foo].user}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Repositories</td>
                    <td >{data[foo].repoCount}</td>
                    </tr>
                    <tr>
                    <td>Commits</td>
                    <td>{data[foo].commits}</td>
                    </tr>
                    <tr>
                    <td>Lines</td>
                    <td>{data[foo].lines}</td>
                    </tr>
                    <tr>
                    <td>PR's</td>
                    <td>{data[foo].prs}</td>
                    </tr>
                    <tr>
                    <td>Stars</td>
                    <td>{data[foo].stars}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default SingleTable;