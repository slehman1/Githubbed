import React from "react"
import { Outlet, Link } from "react-router-dom";

function Layout() {
    return (
        <>
        <nav className="navbar">
          <ul>
          <li>
              <h1>Githubbed</h1>
          </li>
          <li>
              <Link to="/">Login</Link>
            </li>
            
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
          </ul>
        </nav>
  
        <Outlet />
      </>

    )
}

export default Layout;