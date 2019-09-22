require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")

const routes = require("./routes")

const corsOptions = {
    origin: "http://localhost:9000",
    credentials: true
}

;(async () => {
    const app = express()

    // app.use(cors(corsOptions))
    app.use(express.json())
    app.use(bodyParser.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use("/", routes)
    app.use((err, _req, res, _next) => {
        console.log("An error was thrown") // DEBUG
        console.error(err.stack)
        res.json({ message: err.message })
        // res.status(500).send("Something broke!")
    })

    app.listen(9090, () => {
        console.log("express server started")
    })
})()
