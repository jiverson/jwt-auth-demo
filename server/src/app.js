require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const https = require("https")
const fs = require("fs")

const routes = require("./routes")

const corsOptions = {
    origin: `${process.env.CORS}`,
    credentials: true,
}

const serverOptions = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.crt"),
}

;(async () => {
    const app = express()

    app.use(cors(corsOptions))
    app.use(express.json())
    app.use(bodyParser.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use("/", routes)
    app.use((err, _req, res, _next) => {
        console.log("-------- An error was thrown --------") // DEBUG
        console.error(err.stack)
        console.log("-------------------------------------") // DEBUG
        res.json({ message: err.message })
    })

    https.createServer(serverOptions, app).listen(process.env.PORT, () => {
        console.log(`express server started on port https://localhost:${process.env.PORT}`)
    })
})()
