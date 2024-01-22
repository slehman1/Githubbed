import React from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";

function Login() {

  const [username, setUser1] = React.useState("")
  const [password1, setPassword1] = React.useState("")
  const [password2, setPassword2] = React.useState("")
  const [loaderFlag, setLoaderFlag] = React.useState(false)
  const navigate = useNavigate();


  async function handleForm(e){
    e.preventDefault()
    if (password1 !== password2){
        alert("passwords don't match dummy")
    } else if (password1.length < 5){
        alert("password is too short dummy")
    }
    setLoaderFlag(true)
    const body = {username: username, password: password1}
    const response = await axios.post("https://githubber-backend.vercel.app/register", body)
    console.log(response)
    if (response.data === "Success"){
      navigate("/")
    } else if (response.data === "Username") {
      alert("Username already in use")
    } else {
      alert("Error")
    }

    setLoaderFlag(false)
  }





  return (
    <div>
      <h1>Register</h1>
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