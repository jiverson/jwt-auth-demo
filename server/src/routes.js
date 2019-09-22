const Router = require("express-promise-router")
const SchemaValidator = require("./schema-validator")
const db = require("./db")
const users = require("./users")

const router = new Router()
const validateRequest = SchemaValidator(true)

router.get("/", (_req, res) => res.send("Hello world"))

router.get("/pg", async (_req, res) => {
    const { rows } = await db.query("SELECT $1::text as message", ["From postgres!"])
    res.send(rows[0].message)
})

router.post("/revoke_token", async (req, res) => {
    await users.revokeToken(req.body)
    res.send(true)
})

router.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid
    const { refresh_token, ...data } = users.refreshToken(token)
    res.cookie("jid", refresh_token, {
        httpOnly: true,
        path: "/refresh_token"
    })
    res.send(data)
})

router.post("/register", validateRequest, users.register)

router.post("/login", validateRequest, async (req, res) => {
    const { refresh_token, ...data } = await users.login(req.body)
    res.cookie("jid", refresh_token, {
        httpOnly: true,
        path: "/refresh_token"
    })
    res.send(data)
})

router.post("/logout", async (_req, res) => {
    res.cookie("jid", "", {
        httpOnly: true,
        path: "/refresh_token"
    })
    res.send(true)
})

module.exports = router
