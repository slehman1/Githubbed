import React from "react"
import axios from "axios"
import Cookies from "js-cookie"
import Card from "../components/Card"

//bootstrap imports
import {Spinner, Container} from "react-bootstrap"

//vercel: https://githubber-backend.vercel.app

function Account(props) {

  
  const [card, setCard] = React.useState()
  const [usernameName, setUsernameName] = React.useState()
  const [loaderFlag, setLoaderFlag] = React.useState(false)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)

  React.useEffect(() => {
    async function fetchData() {
      const username = Cookies.get("username")
      if (username) {
        setIsLoggedIn(true)
      }
      setUsernameName(username)
      if (username) {
        setLoaderFlag(true)
        const body = {username: username}
        const response = await axios.post("https://githubber-backend.vercel.app/user", body)
        const userData = response.data
        console.log(userData)
        const newCard = <Card data={userData}/>
        setCard(newCard)
        setLoaderFlag(false)
      } else {
        //
      }
      
    }
    fetchData()
  }, [])





  return (
    <Container>
      <h1>Account</h1>
      <h2>Hello {usernameName}</h2>
      {!isLoggedIn && <h2>Pls login dummy</h2>}
      <div className="card-container">
      <div  className="card-div">
      {card}

      </div>

      </div>
      {loaderFlag && <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>}
    </Container>
  );
}

export default Account;
