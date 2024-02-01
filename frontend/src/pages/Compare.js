import React from "react"
import axios from "axios"
import CompareTable from "../components/CompareTable"
import PieChart from "../components/PieChart"

//bootstrap imports
import {Spinner, Form, Button, Container, Row, Col} from "react-bootstrap"

function Compare() {

  const [user1, setUser1] = React.useState("")
  const [user2, setUser2] = React.useState("")
  const [dataTables, setDataTables] = React.useState()
  const [recentDataTables, setRecentDataTables] = React.useState()
  const [languagePies, setLanguagePies] = React.useState()
  const [loaderFlag, setLoaderFlag] = React.useState(false)
  const [displayFlag, setDisplayFlag] = React.useState(false)


  async function handleForm(e){
    e.preventDefault()
    setLoaderFlag(true)
    const body = {user1: user1, user2: user2}
    const response = await axios.post("https://githubber-backend.vercel.app/compare", body)
    const responseData = response.data
    console.log(responseData)
    const tables = <CompareTable data={responseData} />
    setDataTables(tables)
    const recentTable = <CompareTable data={responseData} recent={true}/>
    setRecentDataTables(recentTable)
    const pies = response.data.map((user, index) => (<PieChart key={index} displayUser={true} user={user.total.user} languages={user.total.languageDict} />))
    setLanguagePies(pies)

    
    setLoaderFlag(false)
    setDisplayFlag(true)

    
  }





  return (
    <div>
      <h1>CompareToo</h1>
      <p>Input two Github usernames to compare stats</p>
      <Form onSubmit={handleForm}>
        <Form.Group className="mb-3">
          <Form.Control className="mb-3" type="text" placeholder="User 1" value={user1} onChange={(e) => setUser1(e.target.value)} />
          <Form.Control className="mb-3" type="text" placeholder="User 2" value={user2} onChange={(e) => setUser2(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" >
          Submit
        </Button>
      </Form>
      
      {loaderFlag && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}

    
      <Container style={{textAlign: "center"}}>
      <Row>
      <Col>
      {displayFlag && <h2>Total Activity</h2>}
      <div className="card-container">
        {dataTables}
      </div>
      </Col>
      
      <Col>
      {displayFlag && <h2>Recent Activity (3m)</h2>}
      <div className="card-container">
        {recentDataTables}
      </div>

      </Col>
      

      </Row>
      <Row>
      {languagePies}
      

      </Row>
      
      
      

      </Container>
        
      
      
      
      
    </div>
  );
}

export default Compare;
