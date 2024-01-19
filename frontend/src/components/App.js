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

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="account" element={<Account />} />
          <Route path="compare" element={<Compare />} />
          <Route path="repoStats" element={<RepoStats />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
