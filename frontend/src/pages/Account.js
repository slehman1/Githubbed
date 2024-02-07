import React from "react"
import axios from "axios"
import Cookies from "js-cookie"
import Card from "../components/Card"

//bootstrap imports
import {Spinner, Container} from "react-bootstrap"

//vercel: https://githubber-backend.vercel.app

function Account() {

  
  const [card, setCard] = React.useState()
  const [usernameName, setUsernameName] = React.useState()
  const [loaderFlag, setLoaderFlag] = React.useState(false)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)



  React.useEffect(() => {
    async function fetchData() {
      const username = Cookies.get("username")
      console.log("cookiesuser", username)
      if (username) {
        setIsLoggedIn(true)
      }
      setUsernameName(username)
      console.log("usernamename", usernameName)
      if (username) {
        setLoaderFlag(true)
        const body = {username: username}
        // const response = await axios.post("http://localhost:8080/user", body)
        // const userData = response.data
        const userData = await graphql(username)
        console.log(userData)
        const newCard = <Card displayPie={true} data={userData}/>
        setCard(newCard)
        setLoaderFlag(false)
      } else {
        //
      }
      
    }
    fetchData()
  }, [])

  const githubAPIEndpoint = 'https://api.github.com/graphql'

const headers = {
    "Content-Type" : "application/json",
    Authorization: "bearer " + process.env.REACT_APP_AUTH_KEY
}


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
          // console.log(userReturnData)
          

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
    <Container>
      <h1>Account</h1>
      <h2>Hello {usernameName}</h2>
      {!isLoggedIn && <h2>Pls login dummy</h2>}
      <div className="card-container">
      <div  className="card-div">
      {card}

      </div>

      </div>
      {loaderFlag && <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>}
    </Container>
  );
}

export default Account;
