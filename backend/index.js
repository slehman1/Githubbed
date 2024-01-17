import express from "express";

const port = 3000

const app = express()


app.listen(port, () => {
    console.log("listening on port 3000")
});