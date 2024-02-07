import React from "react"
import { Form, Container, Row, Col, Spinner, Button, Alert } from "react-bootstrap";
import StarredRepos from "../components/StarredRepos";
import PieChart from "../components/PieChart";
import Profile from "../components/Profile";
import Card from "../components/Card";
import Cookies from "js-cookie"
import SingleTable from "../components/SingleTable";
import axios from "axios";

function ForYou(){

    const [starredReposCheck, setStarredReposCheck] = React.useState(false)
    const [languagesCheck, setLanguagesCheck] = React.useState(false)
    const [profileInfoCheck, setProfileInfoCheck] = React.useState(false)
    const [accountCardCheck, setAccountCardCheck] = React.useState(false)
    const [singleTableTotalCheck, setSingleTableTotalCheck] = React.useState(false)
    const [singleTable3MCheck, setSingleTable3MCheck] = React.useState(false)
    const [userData, setUserData] = React.useState()
    const [loaderFlag, setLoaderFlag] = React.useState(false)
    const [successFlag, setSuccessFlag] = React.useState(false)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [layout, setLayout] = React.useState({})
    const [notLoggedIn, setNotLoggedIn] = React.useState(false)


    ///
    React.useEffect(() => {
        async function fetchData() {
          const username = Cookies.get("username")
          if (username) {
            setLoaderFlag(true)
            // const body = {username: username}
            // const response = await axios.post("http://localhost:8080/user", body)
            // const userData = response.data
            const userDataResponse = await graphql(username)
            setUserData(userDataResponse)
            getLayout()
            setLoaderFlag(false)
          } else {
            //
          }
          
        }
        //https://githubber-backend.vercel.app
        async function getLayout(){
            //return layout map
            const username = Cookies.get("username")
            const body = {username: username}
            const response = await axios.post(`https://githubber-backend.vercel.app/getlayout`, body)
            const layoutz = JSON.parse(response.data["for_you"])
            setLayout(layoutz)
            createDropZones(layoutz)
        }
        const username = Cookies.get("username")
        if (username) {
          fetchData()
          
        } else {
          setNotLoggedIn(true)
        }
        
      }, [])
    

    
    async function graphql(username){
      const userz1Data = await userStats(username)
      return userz1Data
    }
    
    async function userStats(username, rangeEpoch){
    
      return fetch(githubAPIEndpoint, {
          method: "POST", 
          headers: headers,
          body: JSON.stringify({
              query: `
              query getInfo($username: String!) {
                user(login: $username){
                  issues{
                    totalCount
                  }
                  bio
                  company
                  createdAt
                  email
                  followers{
                    totalCount
                  }
                  isHireable
                  location
                  name
                  organizations{
                    totalCount
                  }
                  pullRequests(first: 100){
                    totalCount
                    nodes{
                      createdAt
                      # body
                    }
                  }
                  starredRepositories{
                    nodes{
                      url
                      name
                      createdAt
                    }
                    totalCount
                    
                  }
                  repositories(first: 100){
                    totalCount
                    nodes {
                      owner {
                        login
                      }
                      stargazerCount
                      stargazers(first: 100){
                        nodes{
                          createdAt
                          name
                        }
                        totalCount
                      }
                      name
                      createdAt
                      languages(first: 100){
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
              }
              `,
              variables: {"username": username} 
          })})
          .then(res =>  res.json())
          .then(data => {
              const userData = data.data.user
              const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000 
              const threeMonthRange = Date.now() - threeMonths
              var totalLines = 0
              var recentLines = 0
              var totalStars = 0
              var recentStars = 0
              var recentRepos = 0
              var totalCommits = 0
              var recentCommits = 0
              var recentPRs = 0
              const languageDict = {}
              //gonna do language bytes only for the repos that you own
    
              //calculate recent prs
              userData.pullRequests.nodes.forEach(pr => {
                  const prDate = new Date(pr.createdAt).getTime()
                  if (prDate > threeMonthRange) {
                      recentPRs += 1
                  }
    
              })
              //
    
    
              //loop through commits to get lines added and deleted 
              userData.repositories.nodes.forEach((repo) => {
                  const linesHelperRes = linesHelper(repo.defaultBranchRef, threeMonthRange)
                  totalLines += linesHelperRes.linesArray[linesHelperRes.linesArray.length - 1]
                  recentLines += linesHelperRes.recentLines
                  totalStars += repo.stargazerCount
                  const repoCreateDate = new Date(repo.createdAt).getTime()
                  if (repoCreateDate > threeMonthRange){
                      recentRepos += 1
                  }
                  repo.stargazers.nodes.forEach((stargazer) => {
                      const starDate = new Date(stargazer.createdAt).getTime()
                      if (starDate > threeMonthRange) {
                          recentStars += 1
                      }
                  })
                  //languages
                  const repoLanguages = repo.languages.edges
                  repoLanguages.forEach(repo => {
                      if (repo.node.name in languageDict) {
                          languageDict[repo.node.name] += repo.size
                      } else {
                          languageDict[repo.node.name] = repo.size
                      }
                  })
                  const commits = repo.defaultBranchRef.target.history.nodes
                  commits.forEach(commit => {
                      totalCommits += 1
                      const commitDate = new Date(commit.committedDate).getTime()
                      if (commitDate > threeMonthRange){
                          recentCommits += 1
                      }
                  })
    
              })
              
              const userReturnData = {
                  total: {
                      user: username,
                      stars: totalStars,
                      commits: totalCommits,
                      prs: userData.pullRequests.totalCount,
                      lines: totalLines,
                      repoCount: userData.repositories.totalCount,
                      openIssues: userData.issues.totalCount,
                      languageDict: languageDict,
                      bio: userData.bio,
                      createdAt: userData.createdAt,
                      company: userData.company,
                      location: userData.location,
                      starredRepos: userData.starredRepositories.nodes
          
                  }, 
                  recent: {
                      user: username,
                      stars: recentStars,
                      commits: recentCommits,
                      prs: recentPRs,
                      lines: recentLines,
                      repoCount: recentRepos
                  }
              }
              return userReturnData
    
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
    
    











    ///




   
    const githubAPIEndpoint = 'https://api.github.com/graphql'

    const headers = {
        "Content-Type" : "application/json",
        Authorization: "bearer " + process.env.REACT_APP_AUTH_KEY
    }

    function createDropZones(layouts) {
        const dropElements = document.getElementsByClassName("drop-container")
        for (let i = 0; i < dropElements.length; i++){
            const currElement = dropElements[i]
            currElement.style.border = "solid"
            currElement.style.borderRadius = "10px"
            currElement.style.width = "300px"
            currElement.style.height = "300px"
            // currElement.style.cursor  = "move"
            currElement.addEventListener('dragover', function(e){
                e.preventDefault()
            })
            currElement.addEventListener('drop', (e) => {
              //if dropping onto a filled dropzone, swap, else just drop
              //if dropping onto a filled dropzone from starting then move swap into holder
              const childList = currElement.children
              if (childList.length === 1){
                //has something already
                  const childId = childList[0].id
                  const childEl = document.getElementById(childId)
                  const incomingID = e.dataTransfer.getData('text')
                  const incomingEl = document.getElementById(incomingID)
                  
                  const incomingParent = incomingEl.parentNode
                  currElement.replaceChild(incomingEl, childEl)
                  incomingParent.appendChild(childEl)
                  childEl.style.border = "none"
                  
              } else {
                const id = e.dataTransfer.getData('text');
                const dragEl = document.getElementById(id)
                currElement.appendChild(dragEl)
                dragEl.style.width = "100%"
                dragEl.style.height = "100%"
                dragEl.style.border = "none"
                e.dataTransfer.clearData()

              }

                
                
            })
            console.log("layout")
            console.log(layouts)
            const componentsMap = {"starred-repos": setStarredReposCheck, "profile-info": setProfileInfoCheck, "recent": setSingleTable3MCheck, "total": setSingleTableTotalCheck, "pie-chart": setLanguagesCheck, "card": setAccountCardCheck}
            if (currElement.id in layouts){
                const childId = layouts[currElement.id]
                const childEl = document.getElementById(childId)
                childEl.style.display = ""
                childEl.style.border = "none"
                currElement.appendChild(childEl)
                componentsMap[childId](true)
            } else {
              //
            }
        }

    }

    async function saveLayout(){
        const layoutMap = {}
        const username = Cookies.get("username")
        const dropElements = document.getElementsByClassName("drop-container")
        for (let i = 0; i < dropElements.length; i++){
            const currElement = dropElements[i]
            //each container dropzone should only have one child
            const childList = currElement.children
            if (childList.length === 1){
                const childId = childList[0].id
                layoutMap[currElement.id] = childId
            }
        }
        //store layout map in db
        const body = {username: username, layout: layoutMap}
        const response = await axios.post("http://localhost:8080/storelayout", body)
        if (response.data === "Success") {
            setSuccessFlag(true)
        } else {
            setErrorFlag(true)
        }
        

        
    }

    function handleCheck(id, state, setFunc){
      const componentEl = document.getElementById(id)
      if (state){
        //was checked now uncheck so hide el
        componentEl.style.display = "none"
        //if parent isnt holder container then move it back to holder (basically deleting from dropzone)
        if (componentEl.parentNode.id !== "general-holder-id"){
          const holderEl = document.getElementById("general-holder-id")
          holderEl.appendChild(componentEl)
        }
      } else {
        componentEl.style.display = ""
      }
      setFunc(prevState => !prevState)
    }

    


   

    


   


    return (
        <Container>
        <h2>Hello Doggy</h2>
        {notLoggedIn && <h2>Pls login</h2>}
        {loaderFlag && <Spinner animation="border" role="status"></Spinner>}
        {!notLoggedIn && <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group className="mb-3" >
            <Form.Check checked={languagesCheck ? true : false} style={{display: "inline"}} type="checkbox" onChange={() => handleCheck("pie-chart", languagesCheck, setLanguagesCheck)}/><Form.Label style={{display: "inline"}}>Languages</Form.Label>
            <Form.Check checked={profileInfoCheck ? true : false} style={{display: "inline"}} type="checkbox" onChange={() => handleCheck("profile-info", profileInfoCheck, setProfileInfoCheck)}/><Form.Label style={{display: "inline"}}>Profile Info</Form.Label>
            <Form.Check checked={accountCardCheck ? true : false} style={{display: "inline"}} type="checkbox" onChange={() => handleCheck("card", accountCardCheck, setAccountCardCheck)}/><Form.Label style={{display: "inline"}}>Account Card</Form.Label>
            <Form.Check checked={starredReposCheck ? true : false} style={{display: "inline"}} type="checkbox" onChange={() => handleCheck("starred-repos", starredReposCheck, setStarredReposCheck)}/><Form.Label style={{display: "inline"}}>Starred Repos</Form.Label>
            <Form.Check checked={singleTableTotalCheck ? true : false} style={{display: "inline"}} type="checkbox" onChange={() => handleCheck("total", singleTableTotalCheck, setSingleTableTotalCheck)}/><Form.Label style={{display: "inline"}}>Totals Table</Form.Label>
            <Form.Check checked={singleTable3MCheck ? true : false} style={{display: "inline"}} type="checkbox" onChange={() => handleCheck("recent", singleTable3MCheck, setSingleTable3MCheck)}/><Form.Label style={{display: "inline"}}>3-Month Table</Form.Label>
            <Button variant="primary" type="button" onClick={() => saveLayout()}> Save Layout</Button>{successFlag ? <Alert variant="success">Successfully Saved</Alert> : null} {errorFlag ? <Alert variant="danger">Error Saving</Alert> : null}
        
        </Form.Group>
        </Form>}
        <Container>
        <Container id="general-holder-id" className="general-holder">
        {userData && <PieChart limitSize={true} display="none" languages={userData.total.languageDict}/>}
        {userData && <StarredRepos display="none" data={userData}/>}
        {userData && <Card metrics={true} display="none" displayPie={false} data={userData}/>}
        {userData && <Profile display="none" data={userData}/>}
        {userData && <SingleTable display="none" data={userData}/>}
        {userData && <SingleTable display="none" recent={true} data={userData}/>}

        </Container>
        <Container className="starter-container">
        

        </Container>
        <Container className="starter-container">
        

        </Container>
        <Container className="starter-container">
       

        </Container>
        <Container className="starter-container" >
        

        </Container>
        <Container className="starter-container">
        

        </Container>
            
        <Container className="starter-container">
        

        </Container>
            
            
            
            
            
        </Container>
        <Container style={{width: "900px", height: "900px", alignItems: "center", justifyContent: "center", margin: "0px"}} id="big-container">
            <Row>
            <Col style={{width: "300px"}}>
            <Container className="drop-container m-0" id="top-left">

            </Container>
            </Col>
            <Col style={{width: "300px"}}>
            <Container className="drop-container m-0" id="top-middle">

            </Container>
            </Col>
            <Col style={{width: "300px"}}>
            <Container className="drop-container m-0" id="top-right">

            </Container>
            </Col>
            
            </Row>
            <Row>
            <Col style={{width: "300px"}}>
            <Container className="drop-container m-0" id="bottom-left">

            </Container>

            </Col>
            <Col style={{width: "300px"}}>
            <Container className="drop-container m-0" id="bottom-middle">

            </Container>
            </Col>
            <Col style={{width: "300px"}}>
            <Container className="drop-container m-0" id="bottom-right">

            </Container>
            </Col>
            </Row>

        </Container>


        </Container>
        
    )

}




export default ForYou;