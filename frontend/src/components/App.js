import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Compare from "../pages/Compare.js"
import Layout from "../pages/Layout.js"
import RepoStats from "../pages/RepoStats.js";
import NoPage from "../pages/NoPage.js";
import Login from "../pages/Login.js";
import Register from "../pages/Register.js"
import Account from "../pages/Account.js";
import Logout from "../pages/Logout.js";
import ForYou from "../pages/ForYou.js";
import 'bootstrap/dist/css/bootstrap.min.css';




function App() {

  const [isLoggedIn, setIsLoggedIn] = React.useState()
  const [darkMode, setDarkMode] = React.useState(false)
  
  React.useEffect(setBg, [darkMode])

  function setBg() {
    if (document.documentElement.getAttribute('data-bs-theme') === 'dark') {
      document.documentElement.setAttribute('data-bs-theme','light')
    }
    else {
        document.documentElement.setAttribute('data-bs-theme','dark')
    }
  }
  
  
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout setDarkMode={setDarkMode} darkMode={darkMode} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />}>
          <Route index element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="logout" element={<Logout setIsLoggedIn={setIsLoggedIn}/>} />
          <Route path="register" element={<Register />} />
          <Route path="account" element={<Account />} />
          <Route path="foryou" element={<ForYou />} />
          <Route path="compare" element={<Compare />} />
          <Route path="repoStats" element={<RepoStats/>} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
