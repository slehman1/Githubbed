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
      <p>Pls login</p>
        <Form onSubmit={handleForm}>
        <Form.Group className="mb-3" >
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Form.Label>Password</Form.Label>
          <Form.Control type={hidePassword ? "password" : "text"}  value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />{!hidePassword ? <Button type="button" onClick={() => setHidePassword(prevState => !prevState)}>Hide From The Ops</Button> : <Button type="button" onClick={() => setHidePassword(prevState => !prevState)}>No Ops Around</Button>}
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
