import React from "react"
import axios from "axios"
import Card from "../components/Card"

function Account() {

  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
 
  const [loaderFlag, setLoaderFlag] = React.useState(false)


  async function handleForm(e){
    e.preventDefault()
    setLoaderFlag(true)
    
    setLoaderFlag(false)
  }





  return (
    <div>
      <h1>Githubbed</h1>
      <p>Account home</p>
      <p>Lots of interesting information</p>
      
      {loaderFlag && <div className="loader"></div>}
    </div>
  );
}

export default Account;
