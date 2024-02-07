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
  const [noReposFlag, setNoReposFlag] = React.useState(false)
  const [displayRepoOptionsFlag, setDisplayRepoOptionsFlag] = React.useState(false)
  const [displayDataFlag, setDisplayDataFlag] = React.useState(false)

  const debounceOnChange = React.useCallback(debounce(onChange, 800), []);

  async function onChange(value) {
    
    setWrongUsernameFlag(false)
    setNoReposFlag(false)
    const body = {user1: value}
    setUser1(value)
    setLoaderFlag(true)
    const response = await axios.post("https://githubber-backend.vercel.app/repos", body)
    if (response.data === "Error") {
      setWrongUsernameFlag(true)
      setLoaderFlag(false)
      return
    } else if (response.data.length === 0){
      setNoReposFlag(true)
      setLoaderFlag(false)
      return
    }
    const newRepoSelector = response.data.map((repo, index) => (
      <option key={index} value={repo}>{repo}</option>
  ))
    setRepoSelector(newRepoSelector)
    setLoaderFlag(false)
    setDisplayRepoOptionsFlag(true)
  }


  async function handleRepoForm(e){
    e.preventDefault()
    const body = {user1: user1, repo: repo}
    if (optionsState === "None") {
      alert("Invalid input dummy")
      return
    }
    setLoaderFlag(true)
    // const response = await axios.post("https://githubber-backend.vercel.app/repoInfo", body)
    const response = await graphql()
    console.log("responsebleow")
    console.log(response)
    setRepoName(repo)
    setRepoPie(<PieChart languages={response.languages} />)
    setRepoLineChart(<LineChart lines={response.lineNums} />)
    const newInfoKeys = Object.keys(response.info)
    const newInfo = newInfoKeys.map((key, index) => (
        <p key={index}>{key}: {response.info[key]}</p>
    ))
    setRepoInfo(newInfo)
    setOptionsState("None")
    setLoaderFlag(false)
    setDisplayDataFlag(true)
  }

  function handleChange(e){
    e.preventDefault()
    setDisplayRepoOptionsFlag(false)
    setDisplayDataFlag(false)
    debounceOnChange(e.target.value)
  }

  const githubAPIEndpoint = 'https://api.github.com/graphql'

const headers = {
    "Content-Type" : "application/json",
    Authorization: "bearer " + process.env.REACT_APP_AUTH_KEY
}

  async function graphql(){

    //get bytes per language and repo info and line counts
    return fetch(githubAPIEndpoint, {
        method: "POST", 
        headers: headers,
        body: JSON.stringify({
            query: `
            query getRepoInfo($username: String!, $repo: String!) {
                user(login: $username){
                  repository(name: $repo){
                    forkCount
                    stargazerCount
                    issues{
                      totalCount
                    }
                        languages(first: 100){
                      totalSize
                      edges{
                        node{
                          name
                        }
                        size
                      }
                    }
                    defaultBranchRef{
                        target{
                          ... on Commit {
                            history {
                              totalCount
                              nodes{
                                committedDate
                                additions
                                deletions
                              }
                            }
                          }
                        }
                      }
                      
                    }
                  }
                }
            `,
            variables: {"username": user1, repo: repo} 
        })})
        .then(res =>  res.json())
        .then(data => {
          
            const repository = data.data.user.repository
            //package to send
            const repoInfo = {
                forks: repository.forkCount,
                stars: repository.stargazerCount,
                openIssues: repository.issues.totalCount,
            }
            const repoLanguageDict = {}
            repository.languages.edges.forEach((language) => {
                repoLanguageDict[language.node.name] = language.size
            })
            //get lines
            const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000 
            const threeMonthRange = Date.now() - threeMonths
            const linesRes = linesHelper(repository.defaultBranchRef, threeMonthRange)
            const resData = {
            languages: repoLanguageDict,
            lineNums: linesRes.linesArray,
            info: repoInfo
            }
            
            return resData
            
        })
        .catch(err => console.log(err))
  }

  function linesHelper(data, rangeDate){
    //get all commmits and then get lines added and deleted per commit
    //return an array of the lines over time as well as a total line number for the repo that is recent
    const commits = data.target.history.nodes
    const linesArray = []
    var recentLines = 0
    var z = 0
    for (let i = commits.length - 1; i > -1; i--){
        z += 1
        const currCommit = commits[i]
        const change = currCommit.additions - currCommit.deletions
        
        const commitDate = new Date(currCommit.committedDate).getTime()
        if (commitDate > rangeDate) {
            recentLines += change
        }
        if (i === commits.length - 1){
            linesArray.push(change)
        } else {
            linesArray.push(change + linesArray[z - 2])
        }
    }
    const returnObj = {
        linesArray: linesArray,
        recentLines: recentLines
    }
    return returnObj

}



  return (
    <Row>
    <Container>
      <h1>Repo Stats</h1>
      <p>Pls input a user to see public repos</p>

      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3">
          <Form.Label>Github Username</Form.Label>
          <Form.Control type="text" placeholder="Username"  onChange={handleChange} />
        </Form.Group>
      </Form>
      {wrongUsernameFlag && <Alert variant="danger">Invalid username dummy!</Alert>}
      {noReposFlag && <Alert variant="danger">No repos for this username!</Alert>}

      {displayRepoOptionsFlag && <Form className="mb-3" onSubmit={handleRepoForm}>
        <Form.Group className="mb-3">
        <Form.Select value={optionsState} onChange={
              (e) => {setRepo(e.target.value)
              setOptionsState(e.target.value)}}
               name="repo">
                <option defaultValue={true} hidden value="None">Select a Repo</option>
                {repoSelector}
        </Form.Select>
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>}
      

        <div>

        {loaderFlag && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}

        </div>
        {displayDataFlag && <Container>
          <h2 id="repo-name-title">{repoName}</h2>
          <div style={{border: "solid", borderRadius: "10px"}} className="card-container">
      
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
      </Container>}

    </Container>
    </Row>
  );
}

export default RepoStats;
