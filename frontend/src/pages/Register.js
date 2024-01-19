import React from "react"
import axios from "axios"
import Card from "../components/Card"

function Login() {

  const [username, setUser1] = React.useState("")
  const [password1, setPassword1] = React.useState("")
  const [password2, setPassword2] = React.useState("")
  const [loaderFlag, setLoaderFlag] = React.useState(false)


  async function handleForm(e){
    e.preventDefault()
    setLoaderFlag(true)
    if (password1 !== password2){
        alert("passwords don't match dummy")
    } else if (password1.length < 5){
        alert("password is too short dummy")
    }
    
    setLoaderFlag(false)

    
  }





  return (
    <div>
      <h1>Githubbed</h1>
      <p>Pls register</p>
      <form onSubmit={handleForm}>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUser1(e.target.value)} />
      <input type="text" placeholder="Password" value={password1} onChange={(e) => setPassword1(e.target.value)}/>
      <input type="text" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
      <input type="submit" value={"Submit"}/>
      </form>
      {loaderFlag && <div className="loader"></div>}
    </div>
  );
}

export default Login;