import React from "react"
import axios from "axios"
import Card from "../components/Card"

function Login() {

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
      <p>Pls login</p>
      <form onSubmit={handleForm}>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      <input type="submit" value={"Submit"}/>
      </form>
      {loaderFlag && <div className="loader"></div>}
    </div>
  );
}

export default Login;
