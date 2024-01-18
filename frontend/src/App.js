import React from "react"
import axios from "axios"
import Card from "./Card"

function App() {

  const [user1, setUser1] = React.useState("")
  const [user2, setUser2] = React.useState("")
  const [userCards, setUserCards] = React.useState()


  async function handleForm(e){
    e.preventDefault()
    const body = {user1: user1, user2: user2}
    const response = await axios.post("http://localhost:8080/compare", body)
    // const {user1Repos, user2Repos} = response.data
    console.log(response.data)
    const cards = response.data.map((userData, index) => (<Card key={index} prs={userData.prs} commits={userData.commits} stars={userData.stars} languageDict={userData.languageDict} user={userData.user} repos={userData.repoCount} bytes={userData.totalBytes} issues={userData.openIssues}/>))
    console.log(cards)
    setUserCards(cards)


    // const responseData = response.data
    
    
  }





  return (
    <div>
      <h1>Githubbed</h1>
      <p>Pls input two valid Github users to compare stats</p>
      <form onSubmit={handleForm}>
      <input type="text" placeholder="User 1" value={user1} onChange={(e) => setUser1(e.target.value)} />
      <input type="text" placeholder="User 2" value={user2} onChange={(e) => setUser2(e.target.value)}/>
      <input type="submit" value={"Submit"}/>
      </form>
      <div className="card-container">
        {userCards}
      </div>
      
      
    </div>
  );
}

export default App;
