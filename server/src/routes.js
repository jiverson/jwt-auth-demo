const Router = require("express-promise-router")
const schemaValidator = require("./schema-validator")
const auth = require("./auth")
const user = require("./user")

const validateRequest = schemaValidator(true)
const router = new Router()

router.get("/", (_req, res) => res.send("Hello world"))

router.post("/register", validateRequest, user.register)
router.post("/login", validateRequest, user.login)
router.post("/logout", user.logout)

router.post("/refresh_token", user.refreshToken)
router.post("/revoke_token", user.revokeToken)

router.get("/profile", auth, user.profile)
router.get("/whoami", auth, user.whoami)

module.exports = router
