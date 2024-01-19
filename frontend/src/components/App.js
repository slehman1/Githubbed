import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Compare from "../pages/Compare.js"
import Layout from "../pages/Layout.js"
import RepoStats from "../pages/RepoStats.js";
import NoPage from "../pages/NoPage.js";



function App() {

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Compare />} />
          <Route path="repoStats" element={<RepoStats />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
