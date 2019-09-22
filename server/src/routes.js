const Router = require("express-promise-router")
const schemaValidator = require("./schema-validator")
const auth = require("./auth")
const db = require("./db")
const user = require("./user")

const router = new Router()
const validateRequest = schemaValidator(true)

router.get("/", (_req, res) => res.send("Hello world"))

router.get("/pg", async (_req, res) => {
    const { rows } = await db.query("SELECT $1::text as message", ["From postgres!"])
    res.send(rows[0].message)
})

router.post("/register", validateRequest, user.register)
router.post("/login", validateRequest, user.login)
router.post("/logout", user.logout)

router.post("/refresh_token", user.refreshToken)
router.post("/revoke_token", user.revokeToken)

router.get("/me", auth, user.me)
router.get("/bye", auth, user.bye)

module.exports = router
