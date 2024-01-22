import React from "react"
import axios from "axios"
import PieChart from "../components/PieChart"
import LineChart from "../components/LineChart"
// import Card from "../components/Card"

function RepoStats(props) {

  
  const [user1, setUser1] = React.useState("")
  const [repo, setRepo] = React.useState("")
  const [repoSelector, setRepoSelector] = React.useState()
  const [optionsState, setOptionsState] = React.useState("None")
  const [repoName, setRepoName] = React.useState()
  const [repoInfo, setRepoInfo] = React.useState()
  const [repoPie, setRepoPie] = React.useState()
  const [repoLineChart, setRepoLineChart] = React.useState()
  const [loaderFlag, setLoaderFlag] = React.useState(false)
  
//   const [userCards, setUserCards] = React.useState()


  async function handleUserForm(e){
    e.preventDefault()
    const body = {user1: user1}
    const response = await axios.post("https://githubber-backend.vercel.app/repos", body)
    // const {user1Repos, user2Repos} = response.data
    console.log(response.data)
    const newRepoSelector = response.data.map((repo, index) => (
        <option key={index} value={repo}>{repo}</option>
    ))
    setRepoSelector(newRepoSelector)
  }

  async function handleRepoForm(e){
    e.preventDefault()
    const body = {user1: user1, repo: repo}
    if (optionsState === "None") {
      alert("Invalid input dummy")
      return
    }
    setLoaderFlag(true)
    const response = await axios.post("https://githubber-backend.vercel.app/repoInfo", body)
    console.log(response.data)
    setRepoName(repo)
    setRepoPie(<PieChart languages={response.data.languages} />)
    setRepoLineChart(<LineChart lines={response.data.lineNums} />)
    const newInfoKeys = Object.keys(response.data.info)
    const newInfo = newInfoKeys.map((key) => (
        <p>{key}: {response.data.info[key]}</p>
    ))
    setRepoInfo(newInfo)
    setOptionsState("None")
    setLoaderFlag(false)
  }





  return (
    <div>
      <h1>Repo Stats</h1>
      <p>Pls input a user to see public repos</p>
      <form onSubmit={handleUserForm}>
      <input type="text" placeholder="User" value={user1} onChange={(e) => setUser1(e.target.value)} />
      <input type="submit" value={"Submit"}/>
      </form>
      <form onSubmit={handleRepoForm}>
            <select value={optionsState} onChange={
              (e) => {setRepo(e.target.value)
              setOptionsState(e.target.value)}}
               name="repo">
                <option value="None">None</option>
                {repoSelector}
            </select>
            <input type="submit"></input>
        </form>
        <div>
        {loaderFlag && <div className="loader"></div>}

        </div>
        <h2 id="repo-name-title">{repoName}</h2>
      <div className="card-container">
        <div className="card-div">
        {repoPie}
        </div>
        <div className="card-div">
        {repoLineChart}
        </div>
        <div className="card-div">
        {repoInfo}
        </div>
      </div>
    </div>
  );
}

export default RepoStats;
