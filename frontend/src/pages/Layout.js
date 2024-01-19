import React from "react"
import { Outlet, Link } from "react-router-dom";

function Layout() {
    return (
        <>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Compare</Link>
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