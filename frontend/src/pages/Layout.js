import React from "react"
import { Outlet, Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Layout(props) {
  const isLoggedIn = props.isLoggedIn
  const [loggedIn, setLoggedIn] = React.useState()
  const navigate = useNavigate()

  React.useEffect(() => {
    setLoggedIn(isLoggedIn)
  }, [isLoggedIn])


  function handleLogout(){
    Cookies.remove("isAuth")
    Cookies.remove("session")
    Cookies.remove("username")
    props.setIsLoggedIn(false)
    navigate("/")
  }






  return (
      <div>
      <nav className="navbar">
        <ul>
        <li>
            <h1>Githubbed</h1>
        </li>
        {!loggedIn && <li><Link to="/">Login</Link></li>}
        {loggedIn && <button className="logout-button" onClick={handleLogout}>Logout</button>}
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/account">Account</Link>
          </li>
          <li>
            <Link to="/compare">Compare</Link>
          </li>
          <li>
            <Link to="/repoStats">Repo Stats</Link>
          </li>
          <li>
          <button className="logout-button" onClick={()=> props.setDarkMode((prevDarkMode) => !prevDarkMode)}>Dark Mode Toggle</button>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
    

  )
}

export default Layout;