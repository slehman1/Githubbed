import express from "express";
import cors from "cors"
import { Octokit } from "octokit";


// maybe you can do some sort of stats comparison app? or leaderboard or something?
// i'm thinking you can query for people's profiles and pull stats around num of lines added/deleted, num of commits, avg commit frequency, etc
// and then compare 2 (or multiple) profiles and see how they match up
// and you could have different leaderboards for different stats
// with all these stats, you could also look into some visualizing tools/packages to spice things up rather than just displaying text


const port = 8080
const app = express()

//{ auth: `personal-access-token123` }
const octokit = new Octokit();

app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))

app.post("/compare", async (req, res) => {
    const {user1, user2} = req.body
    console.log(user1, user2)
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
    console.log(gitResponse1)
    console.log(gitResponse2)

    const resData = {
        user1Data: gitResponse1.data.public_repos,
        user2Data: gitResponse2.data.public_repos
    }
    res.json(resData)
})

app.listen(port, () => {
    console.log("listening on port 8080")
});