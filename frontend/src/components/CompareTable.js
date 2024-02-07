import React from "react"
import Table from 'react-bootstrap/Table';



function CompareTable(props){

    const data = props.data
    
    let foo;

    if (props.recent){
        foo = "recent"
    } else {
        foo = "total"

    }



   
    return (
        <div style={{borderStyle: "solid", textAlign: "center", borderRadius: "10px"}} className="card-div">
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Metrics</th>
                    <th>{data[0][foo].user}</th>
                    <th>{data[1][foo].user}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Repositories</td>
                    <td style={data[0][foo].repoCount > data[1][foo].repoCount ? {backgroundColor: "green"} : {}}>{data[0][foo].repoCount}</td>
                    <td style={data[0][foo].repoCount < data[1][foo].repoCount ? {backgroundColor: "green"} : {}}>{data[1][foo].repoCount}</td>
                    </tr>
                    <tr>
                    <td>Commits</td>
                    <td style={data[0][foo].commits > data[1][foo].commits ? {backgroundColor: "green"} : {}}>{data[0][foo].commits}</td>
                    <td style={data[0][foo].commits < data[1][foo].commits ? {backgroundColor: "green"} : {}}>{data[1][foo].commits}</td>
                    </tr>
                    <tr>
                    <td>Lines</td>
                    <td style={data[0][foo].lines > data[1][foo].lines ? {backgroundColor: "green"} : {}}>{data[0][foo].lines}</td>
                    <td style={data[0][foo].lines < data[1][foo].lines ? {backgroundColor: "green"} : {}}>{data[1][foo].lines}</td>
                    </tr>
                    <tr>
                    <td>PR's</td>
                    <td style={data[0][foo].prs > data[1][foo].prs ? {backgroundColor: "green"} : {}}>{data[0][foo].prs}</td>
                    <td style={data[0][foo].prs < data[1][foo].prs ? {backgroundColor: "green"} : {}}>{data[1][foo].prs}</td>
                    </tr>
                    <tr>
                    <td>Stars</td>
                    <td style={data[0][foo].stars > data[1][foo].stars ? {backgroundColor: "green"} : {}}>{data[0][foo].stars}</td>
                    <td style={data[0][foo].stars < data[1][foo].stars ? {backgroundColor: "green"} : {}}>{data[1][foo].stars}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default CompareTable;