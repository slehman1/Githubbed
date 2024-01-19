import React from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";

function Login() {

  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loaderFlag, setLoaderFlag] = React.useState(false)
  const navigate = useNavigate();

  async function handleForm(e){
    e.preventDefault()
    setLoaderFlag(true)
    const body = {username: username, password: password}
    const response = await axios.post("http://localhost:8080/login", body)
    
    if (response.data === "None") {
      alert("Couldn't find username")
    } else if (response.data === "Wrong") {
      alert("Incorrect password")
    } else {
      //setup cookie
      console.log(response.data)
      navigate("/account")
    }
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
