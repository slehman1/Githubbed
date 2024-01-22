import React from "react"
import axios from "axios"
import Cookies from "js-cookie"
import Card from "../components/Card"

//vercel: https://githubber-backend.vercel.app

function Account(props) {

  
  const [card, setCard] = React.useState()
  const [usernameName, setUsernameName] = React.useState()
  const [loaderFlag, setLoaderFlag] = React.useState(false)

  React.useEffect(() => {
    async function fetchData() {
      setLoaderFlag(true)
      const username = Cookies.get("username")
      setUsernameName(username)
      const body = {username: username}
      const response = await axios.post("http://localhost:8080/user", body)
      const userData = response.data
      const newCard = <Card prs={userData.prs} commits={userData.commits} stars={userData.stars} languageDict={userData.languageDict} user={userData.user} repos={userData.repoCount} bytes={userData.totalBytes} issues={userData.openIssues}/>
      setCard(newCard)
      setLoaderFlag(false)
    }
    fetchData()
  }, [])





  return (
    <div >
      <h1>Account</h1>
      <h2>Hello {usernameName}</h2>
      <p>Lots of interesting information</p>
      <div className="card-container">
      <div className="card-div">
      {card}

      </div>

      </div>
      
      
      
      {loaderFlag && <div className="loader"></div>}
    </div>
  );
}

export default Account;
