import React from "react"
import axios from "axios"
import PieChart from "../components/PieChart"
import LineChart from "../components/LineChart"
import debounce from "lodash.debounce"

//bootstrap imports
import {Spinner, Form, Button, Container, Row, Alert} from "react-bootstrap"

function RepoStats() {

  
  const [user1, setUser1] = React.useState("")
  const [repo, setRepo] = React.useState("")
  const [repoSelector, setRepoSelector] = React.useState()
  const [optionsState, setOptionsState] = React.useState("None")
  const [repoName, setRepoName] = React.useState()
  const [repoInfo, setRepoInfo] = React.useState()
  const [repoPie, setRepoPie] = React.useState()
  const [repoLineChart, setRepoLineChart] = React.useState()
  const [loaderFlag, setLoaderFlag] = React.useState(false)
  const [wrongUsernameFlag, setWrongUsernameFlag] = React.useState(false)
  

  const debounceOnChange = React.useCallback(debounce(onChange, 800), []);

  async function onChange(value) {
    setWrongUsernameFlag(false)
    const body = {user1: value}
    setUser1(value)
    setLoaderFlag(true)
    const response = await axios.post("http://localhost:8080/repos", body)
    if (response.data === "Error") {
      setWrongUsernameFlag(true)
      setLoaderFlag(false)
      return
    }
    console.log(response.data)
    const newRepoSelector = response.data.map((repo, index) => (
      <option key={index} value={repo}>{repo}</option>
  ))
    setRepoSelector(newRepoSelector)
    setLoaderFlag(false)
  }


//https://githubber-backend.vercel.app/repos

  async function handleUserForm(e){
    e.preventDefault()
    const body = {user1: user1}
    const response = await axios.post("http://localhost:8080/repos", body)
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
    <Row>
    <Container>
    <div>
      <h1>Repo Stats</h1>
      <p>Pls input a user to see public repos</p>

      <Form onSubmit={handleUserForm}>
        <Form.Group className="mb-3">
          <Form.Label>Github Username</Form.Label>
          <Form.Control type="text" placeholder="Username"  onChange={e => debounceOnChange(e.target.value)} />
        </Form.Group>
      </Form>
      {wrongUsernameFlag && <Alert variant="danger">Invalid username dummy!</Alert>}

      <Form onSubmit={handleRepoForm}>
        <Form.Group className="mb-3">
        <Form.Select value={optionsState} onChange={
              (e) => {setRepo(e.target.value)
              setOptionsState(e.target.value)}}
               name="repo">
                <option value="None">None</option>
                {repoSelector}
        </Form.Select>
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
      

        <div>

        {loaderFlag && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}

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
    </Container>
    </Row>
  );
}

export default RepoStats;
