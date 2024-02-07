import React from "react"
import axios from "axios"
import CompareTable from "../components/CompareTable"
import PieChart from "../components/PieChart"
// import 'dotenv/config';

//bootstrap imports
import {Spinner, Form, Button, Container, Row, Col} from "react-bootstrap"

function Compare() {

  const [user1, setUser1] = React.useState("")
  const [user2, setUser2] = React.useState("")
  const [dataTables, setDataTables] = React.useState()
  const [recentDataTables, setRecentDataTables] = React.useState()
  const [languagePies, setLanguagePies] = React.useState()
  const [loaderFlag, setLoaderFlag] = React.useState(false)
  const [displayFlag, setDisplayFlag] = React.useState(false)


  //
  const githubAPIEndpoint = 'https://api.github.com/graphql'

const headers = {
    "Content-Type" : "application/json",
    Authorization: "bearer " + process.env.REACT_APP_AUTH_KEY
}

//

  async function handleForm(e){
    e.preventDefault()
    setLoaderFlag(true)
    const body = {user1: user1, user2: user2}
    // const response = await axios.post("http://localhost:8080/compare", body)
    // const responseData = response.data
    
    const responseData = await graphQLTest()
    
    const tables = <CompareTable data={responseData} />
    setDataTables(tables)
    const recentTable = <CompareTable data={responseData} recent={true}/>
    setRecentDataTables(recentTable)
    const pies = responseData.map((user, index) => (<PieChart key={index} displayUser={true} user={user.total.user} languages={user.total.languageDict} />))
    setLanguagePies(pies)

    
    setLoaderFlag(false)
    setDisplayFlag(true)

    
  }

  async function graphQLTest(){
    // const {user1, user2} = req.body
    const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000 
    const threeMonthRange = Date.now() - threeMonths
    const resArray = []
    const userz1Data = await userStats(user1, threeMonthRange)
    const userz2Data = await userStats(user2, threeMonthRange)
    resArray.push(userz1Data)
    resArray.push(userz2Data)
    
    return resArray
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
            console.log("user return data")
            console.log(userReturnData)
            

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





  return (
    <div>
      <h1>Compare</h1>
      <p>Input two Github usernames to compare stats</p>
      <Form onSubmit={handleForm}>
        <Form.Group className="mb-3">
          <Form.Control className="mb-3" type="text" placeholder="User 1" value={user1} onChange={(e) => setUser1(e.target.value)} />
          <Form.Control className="mb-3" type="text" placeholder="User 2" value={user2} onChange={(e) => setUser2(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" >
          Submit
        </Button>
      </Form>
      
      {loaderFlag && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}

    
      <Container style={{textAlign: "center"}}>
      <Row>
      <Col>
      {displayFlag && <h2>Total Activity</h2>}
      <div className="card-container">
        {dataTables}
      </div>
      </Col>
      
      <Col>
      {displayFlag && <h2>Recent Activity (3m)</h2>}
      <div className="card-container">
        {recentDataTables}
      </div>

      </Col>
      

      </Row>
      <Row>
      {languagePies}
      

      </Row>
      
      
      

      </Container>
        
      
      
      
      
    </div>
  );
}

export default Compare;
