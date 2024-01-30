import React from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { Button, Form, Spinner, Alert } from "react-bootstrap"

function Register() {

  const [username, setUser1] = React.useState("")
  const [password1, setPassword1] = React.useState("")
  const [password2, setPassword2] = React.useState("")
  const [loaderFlag, setLoaderFlag] = React.useState(false)
  const [passwordMatchFlag, setPasswordMatchFlag] = React.useState(false)
  const [passwordShortFlag, setPasswordShortFlag] = React.useState(false)
  const [usernameInUseFlag, setUsernameInUseFlag] = React.useState(false)
  const [hidePassword, setHidePassword] = React.useState(false)
  const navigate = useNavigate();


  async function handleForm(e){
    setPasswordMatchFlag(false)
    setPasswordShortFlag(false)
    setUsernameInUseFlag(false)
    e.preventDefault()
    if (password1 !== password2){
        setPasswordMatchFlag(true)
        return
    } else if (password1.length < 5){
      setPasswordShortFlag(true)
        return
    }
    setLoaderFlag(true)
    const body = {username: username, password: password1}
    const response = await axios.post("https://githubber-backend.vercel.app/register", body)
    if (response.data === "Success"){
      navigate("/")
    } else if (response.data === "Username") {
      setUsernameInUseFlag(true)
    } else {
      alert("Error")
    }

    setLoaderFlag(false)
  }





  return (
    <div>
      <h1>Register</h1>
      <Form onSubmit={handleForm}>
        <Form.Group className="mb-3">
          <Form.Control className="mb-3" placeholder="Username" value={username} onChange={(e) => setUser1(e.target.value)} />
          <Form.Control className="mb-3" type={hidePassword ? "password" : "text"}  placeholder="Password" value={password1} onChange={(e) => setPassword1(e.target.value)} />
          <Form.Control className="mb-3" type={hidePassword ? "password" : "text"} placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)}/>
          <Form.Check checked={hidePassword ? true : false} style={{display: "inline"}} type="checkbox" onChange={() => setHidePassword(prevState => !prevState)}/><Form.Label className="pl-3" style={{display: "inline"}}>Hide Password</Form.Label>
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {passwordMatchFlag && <Alert variant="danger">Passwords don't match dummy!</Alert>}
      {passwordShortFlag && <Alert variant="danger">Password too short dummy!</Alert>}
      {usernameInUseFlag && <Alert variant="danger">Username in use, sorry it's a popular site.</Alert>}
      {loaderFlag && <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>}


    
    </div>
  );
}

export default Register;