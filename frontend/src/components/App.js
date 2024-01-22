import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Compare from "../pages/Compare.js"
import Layout from "../pages/Layout.js"
import RepoStats from "../pages/RepoStats.js";
import NoPage from "../pages/NoPage.js";
import Login from "../pages/Login.js";
import Register from "../pages/Register.js"
import Account from "../pages/Account.js";


function App() {

  const [isLoggedIn, setIsLoggedIn] = React.useState()
  const [darkMode, setDarkMode] = React.useState(false)
  console.log(darkMode)
  
  if (darkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout setDarkMode={setDarkMode} darkMode={darkMode} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />}>
          <Route index element={<Login darkMode={darkMode}  setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="register" element={<Register darkMode={darkMode}  />} />
          <Route path="account" element={<Account darkMode={darkMode} />} />
          <Route path="compare" element={<Compare darkMode={darkMode} />} />
          <Route path="repoStats" element={<RepoStats darkMode={darkMode} />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
