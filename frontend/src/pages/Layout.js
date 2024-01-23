import React from "react"
import { Outlet, Link } from "react-router-dom";

//bootstrap imports
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';


function Layout(props) {
  const isLoggedIn = props.isLoggedIn
  const isDarkMode = props.darkMode
  const [loggedIn, setLoggedIn] = React.useState()
  const [darkMode, setdarkMode] = React.useState()

  React.useEffect(() => {
    setLoggedIn(isLoggedIn)
  }, [isLoggedIn])

  React.useEffect(() => {
    setdarkMode(isDarkMode)
  }, [isDarkMode])

  return (
    <Container>
    <Row>
      <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Githubbed</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          {!loggedIn && <Link className="m-2" to="/">Login</Link>}
          {loggedIn && <Link className="m-2" to="/logout">Logout</Link>}
            <Link className="m-2" to="/register">Register</Link>
            <Link className="m-2" to="/account">Account</Link>
            <Link className="m-2" to="/compare">Compare</Link>
            <Link className="m-2" to="/repoStats">Repo Stats</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      
      {darkMode && <Button onClick={()=> props.setDarkMode((prevDarkMode) => !prevDarkMode)}>Light Mode</Button>}
    {!darkMode && <Button onClick={()=> props.setDarkMode((prevDarkMode) => !prevDarkMode)}>Dark Mode</Button>}
    </Navbar>
    </Row>
    <Row>
    <Outlet />
    </Row>
    </Container>



  )
}

export default Layout;