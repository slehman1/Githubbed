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
    // const gitResponse1 = await octokit.request('GET /users/{username}', {
    //     username: user1,
    //     headers: {
    //       'X-GitHub-Api-Version': '2022-11-28'
    //     }
    // })
    // const gitResponse2 = await octokit.request('GET /users/{username}', {
    //     username: user2,
    //     headers: {
    //       'X-GitHub-Api-Version': '2022-11-28'
    //     }
    // })


    //get all their repositories
    const user1Repos = await octokit.request("GET /users/{username}/repos", {
        username: user1,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    // console.log(user1Repos)
    var user1stars = 0
    var user1OpenIssues = 0
    var user1TotalBytes = 0
    user1Repos.data.forEach((repo) => {
        const openIssue = repo.open_issues
        const bytes = repo.size
        const stars = repo.stargazers_count
        user1OpenIssues += openIssue
        user1TotalBytes += bytes
        user1stars += stars
    })

    const user2Repos = await octokit.request("GET /users/{username}/repos", {
        username: user2,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    var user2stars = 0
    var user2OpenIssues = 0
    var user2TotalBytes = 0
    user2Repos.data.forEach((repo) => {
        const openIssue = repo.open_issues
        const bytes = repo.size
        const stars = repo.stargazers_count
        user2OpenIssues += openIssue
        user2TotalBytes += bytes
        user2stars += stars
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
    //calculate commits
    var user1commits = 0
    var user2commits = 0
    for (let i = 0; i < user1Repos.data.length; i++){
        const repoName = user1Repos.data[i].name
        const user1commitsResponse = await octokit.request('GET /repos/{owner}/{repo}/commits?author={owner}', {
            owner: user1,
            repo: repoName,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        user1commits += user1commitsResponse.data.length
    }
    for (let i = 0; i < user2Repos.data.length; i++){
        const repoName = user2Repos.data[i].name
        const user2commitsResponse = await octokit.request('GET /repos/{owner}/{repo}/commits?author={owner}', {
            owner: user2,
            repo: repoName,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        user2commits += user2commitsResponse.data.length
    }
    //calculate pulls
    var user1PullRequests = 0
    var user2PullRequests = 0
    for (let i = 0; i < user1Repos.data.length; i++){
        const repoName = user1Repos.data[i].name
        const user1PullsResponse = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner: user1,
            repo: repoName,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        user1PullRequests += user1PullsResponse.data.length
    }
    for (let i = 0; i < user2Repos.data.length; i++){
        const repoName = user2Repos.data[i].name
        const user2PullsResponse = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
            owner: user2,
            repo: repoName,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        user2PullRequests += user2PullsResponse.data.length
    }

      

    
    
    const resData = []
    const user1Data = {
        user: user1,
        stars: user1stars,
        commits: user1commits,
        prs: user1PullRequests,
        repoCount: user1Repos.data.length,
        openIssues: user1OpenIssues,
        totalBytes: user1TotalBytes,
        languageDict: languageDict1,
    }
    const user2Data = {
        user: user2,
        stars: user2stars,
        commits: user2commits,
        prs: user2PullRequests,
        repoCount: user2Repos.data.length,
        openIssues: user2OpenIssues,
        totalBytes: user2TotalBytes,
        languageDict: languageDict2,
    }
    resData.push(user1Data)
    resData.push(user2Data)
    res.json(resData)

    // const tester = await octokit.request('GET /repos/{owner}/{repo}', {
    //     owner: user1,
    //     repo: "Githubbed",
    //     headers: {
    //       'X-GitHub-Api-Version': '2022-11-28'
    //     }
    // })

    // console.log(tester)

})


app.post("/repos", async (req, res) => {
    const user = req.body.user1
    console.log(user)
    const user1Repos = await octokit.request("GET /users/{username}/repos", {
        username: user,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    const resData = []
    user1Repos.data.forEach(repo => {
        resData.push(repo.name)
    })
    res.json(resData)
})

app.post("/repoInfo", async (req, res) => {
    const {user1, repo} = req.body
    //get bytes per language
    const repoLanguages = await octokit.request('GET /repos/{owner}/{repo}/languages', {
        owner: user1,
        repo: repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    
    //get all commmits and then get lines added and deleted per commit
    const userCommits = await octokit.request('GET /repos/{owner}/{repo}/commits', {
        owner: user1,
        repo: repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    const commitShas = []
    userCommits.data.forEach((commit) => {
        commitShas.push(commit.sha)
    })
    var currLines = 0
    const linesArray = []
    var z = 0
    for (let i = commitShas.length - 1; i > -1; i--){
        z += 1
        const currSha = commitShas[i]
        const response = await octokit.request('GET /repos/{owner}/{repo}/commits/{sha}', {
            owner: user1,
            repo: repo,
            sha: currSha,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        const change = response.data.stats.additions - response.data.stats.deletions
        if (i === commitShas.length - 1){
            linesArray.push(change)
        } else {
            const prevLines = linesArray[z - 2]
            const newTotal = prevLines + change
            linesArray.push(newTotal)
        }
    }

    const repoInfoResponse = await octokit.request('GET /repos/{owner}/{repo}', {
        owner: user1,
        repo: repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
    })

    const repoInfo = {
        forks: repoInfoResponse.data.forks,
        stars: repoInfoResponse.data.stargazers_count,
        openIssues: repoInfoResponse.data.open_issues,
    }

    const resData = {
        languages: repoLanguages.data,
        lineNums: linesArray,
        info: repoInfo
    }

    
    res.json(resData)
})

app.listen(port, () => {
    console.log("listening on port 8080")
});