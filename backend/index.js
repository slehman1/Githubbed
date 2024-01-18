import express from "express";
import cors from "cors"
import { Octokit } from "octokit";
import 'dotenv/config';


// maybe you can do some sort of stats comparison app? or leaderboard or something?
// i'm thinking you can query for people's profiles and pull stats around num of lines added/deleted, num of commits, avg commit frequency, etc
// and then compare 2 (or multiple) profiles and see how they match up
// and you could have different leaderboards for different stats
// with all these stats, you could also look into some visualizing tools/packages to spice things up rather than just displaying text


const port = 8080
const app = express()

//
const octokit = new Octokit({ auth: process.env.AUTH_KEY });



app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.post("/compare", async (req, res) => {
    const {user1, user2} = req.body
    //get user info
    const gitResponse1 = await octokit.request('GET /users/{username}', {
        username: user1,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    
    
    const gitResponse2 = await octokit.request('GET /users/{username}', {
        username: user2,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    //get all their repositories
    const user1Repos = await octokit.request("GET /users/{username}/repos", {
        username: user1,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    var user1OpenIssues = 0
    var user1TotalBytes = 0
    user1Repos.data.forEach((repo) => {
        const openIssue = repo.open_issues
        const bytes = repo.size
        user1OpenIssues += openIssue
        user1TotalBytes += bytes
    })

    const user2Repos = await octokit.request("GET /users/{username}/repos", {
        username: user2,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    var user2OpenIssues = 0
    var user2TotalBytes = 0
    user2Repos.data.forEach((repo) => {
        const openIssue = repo.open_issues
        const bytes = repo.size
        user2OpenIssues += openIssue
        user2TotalBytes += bytes
    })
    //calculate languages
    const languageDict1 = {}
    for (let i = 0; i < user1Repos.data.length; i++){
        const repoName = user1Repos.data[i].name
        const user1Languages = await octokit.request('GET /repos/{owner}/{repo}/languages', {
            owner: user1,
            repo: repoName,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        
        for (var key in user1Languages.data){
            if (key in languageDict1){
                languageDict1[key] = languageDict1[key] + user1Languages.data[key]
            } else {
                languageDict1[key] = user1Languages.data[key]
            }
        }
    }
    const languageDict2 = {}
    for (let i = 0; i < user2Repos.data.length; i++){
        const repoName = user2Repos.data[i].name
        const user2Languages = await octokit.request('GET /repos/{owner}/{repo}/languages', {
            owner: user2,
            repo: repoName,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        
        for (var key in user2Languages.data){
            if (key in languageDict2){
                languageDict2[key] = languageDict2[key] + user2Languages.data[key]
            } else {
                languageDict2[key] = user2Languages.data[key]
            }
        }
    }
    
    
    const resData = []
    const user1Data = {
        user: user1,
        repoCount: gitResponse1.data.public_repos,
        openIssues: user1OpenIssues,
        totalBytes: user1TotalBytes,
        languageDict: languageDict1,
    }
    const user2Data = {
        user: user2,
        repoCount: gitResponse2.data.public_repos,
        openIssues: user2OpenIssues,
        totalBytes: user2TotalBytes,
        languageDict: languageDict2,
    }
    resData.push(user1Data)
    resData.push(user2Data)
    console.log(resData)
    
    res.json(resData)
})

app.listen(port, () => {
    console.log("listening on port 8080")
});