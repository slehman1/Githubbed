import React from "react"
import axios from "axios"

function App() {

  const [user1, setUser1] = React.useState("")
  const [user2, setUser2] = React.useState("")
  // const [repo1, setRepo1] = React.useState("")
  const [displayFlag, setDisplayFlag] = React.useState(false)

  let user1Repos
  let user2Repos

  async function handleForm(e){
    e.preventDefault()
    const body = {user1: user1, user2: user2}
    const response = await axios.post("http://localhost:8080/compare", body)
    // const {user1Repos, user2Repos} = response.data
    const responseData = response.data
    console.log(responseData)
   
    setDisplayFlag(true)
    user1Repos = responseData.user1Data
    user2Repos = responseData.user2Data
  }



  return (
    <div>
      <h1>Githubbed</h1>
      <p>Pls two valid users to get their repo counts</p>
      <form onSubmit={handleForm}>
      <input type="text" placeholder="User 1" value={user1} onChange={(e) => setUser1(e.target.value)} />
      <input type="text" placeholder="User 2" value={user2} onChange={(e) => setUser2(e.target.value)}/>
      <input type="submit" value={"Submit"}/>
      </form>
      {displayFlag && <div><p>{user1} public repos: {user1Repos}</p> <p>{user2} public repos: {user2Repos}</p></div>}
      
    </div>
  );
}

export default App;
