import React from "react"
import axios from "axios"
import Card from "../components/Card"

//bootstrap imports
import {Spinner, Form, Button} from "react-bootstrap"

function App() {

  const [user1, setUser1] = React.useState("")
  const [user2, setUser2] = React.useState("")
  const [userCards, setUserCards] = React.useState()
  const [loaderFlag, setLoaderFlag] = React.useState(false)


  async function handleForm(e){
    e.preventDefault()
    setLoaderFlag(true)
    const body = {user1: user1, user2: user2}
    const response = await axios.post("https://githubber-backend.vercel.app/compare", body)
    // const {user1Repos, user2Repos} = response.data
    console.log(response.data)
    const cards = response.data.map((userData, index) => (<Card key={index} prs={userData.prs} commits={userData.commits} stars={userData.stars} languageDict={userData.languageDict} user={userData.user} repos={userData.repoCount} bytes={userData.totalBytes} issues={userData.openIssues}/>))
    console.log(cards)
    setUserCards(cards)
    setLoaderFlag(false)

    
  }





  return (
    <div>
      <h1>Compare</h1>
      <p>Pls input two valid Github users to compare stats</p>
      <Form onSubmit={handleForm}>
        <Form.Group className="mb-3">
          <Form.Label>User1</Form.Label>
          <Form.Control type="text" placeholder="User 1" value={user1} onChange={(e) => setUser1(e.target.value)} />
          <Form.Label>User2</Form.Label>
          <Form.Control type="text" placeholder="User 2" value={user2} onChange={(e) => setUser2(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" >
          Submit
        </Button>
      </Form>
      
      {loaderFlag && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}

      <div className="card-container">
        {userCards}
      </div>
      
      
    </div>
  );
}

export default App;
