import React from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Button, Form, Spinner, Alert } from "react-bootstrap"

function Login(props) {

  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loaderFlag, setLoaderFlag] = React.useState(false)
  const [hidePassword, setHidePassword] = React.useState(false)
  const [wrongPasswordFlag, setWrongPasswordFlag] = React.useState(false)
  const [wrongUsernameFlag, setWrongUsernameFlag] = React.useState(false)
  const navigate = useNavigate();

  async function handleForm(e){
    setWrongPasswordFlag(false)
    setWrongUsernameFlag(false)
    e.preventDefault()
    setLoaderFlag(true)
    const body = {username: username, password: password}
    const response = await axios.post("https://githubber-backend.vercel.app/login", body)
    
    if (response.data === "None") {
      setWrongUsernameFlag(true)
    } else if (response.data === "Wrong") {
      setWrongPasswordFlag(true)
    } else {
      //setup cookie
      Cookies.set("session", response.data.id)
      Cookies.set("username", response.data.username)
      Cookies.set("isAuth", true)
      //login user
      props.setIsLoggedIn(true)
      navigate("/account")
    }
    setLoaderFlag(false)
  }

  return (
    <div >
      <h1>Login</h1>
        <Form onSubmit={handleForm}>
        <Form.Group className="mb-3" >
          <Form.Control className="mb-3" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Form.Control className="mb-3" type={hidePassword ? "password" : "text"}  value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <Form.Check checked={hidePassword ? true : false} style={{display: "inline"}} type="checkbox" onChange={() => setHidePassword(prevState => !prevState)}/><Form.Label style={{display: "inline"}}>Hide Password</Form.Label>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {wrongPasswordFlag && <Alert variant="danger">Wrong password dummy!</Alert>}
      {wrongUsernameFlag && <Alert variant="danger">Invalid username dummy!</Alert>}
      {loaderFlag && <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>}
      
    </div>
    
    
  );
}

export default Login;
