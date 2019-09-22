const { hash, compare } = require("bcryptjs")
const { verify } = require("jsonwebtoken")

const db = require("./db")

const { createRefreshToken, createAccessToken } = require("./token-util")

const invalidCredentials = (res) =>
    res.status(401).json({
        status: "failed",
        error: "Your email or your password were entered incorrectly."
    })

const register = async (req, res) => {
    const { email, password } = req.body
    const hashedPassword = await hash(password, 12)

    const {
        rows: [data]
    } = await db.createUser([email, hashedPassword])

    res.send(data)
}

const login = async (req, res) => {
    const { email, password } = req.body

    const {
        rows: [user]
    } = await db.findUserByEmail([email])

    if (!user) {
        return invalidCredentials(res)
    }

    const valid = await compare(password, user.password)

    if (!valid) {
        return invalidCredentials(res)
    }

    // omit password
    const { password: removed, tokenVersion, ...data } = user

    res.cookie("jid", createRefreshToken(user), {
        httpOnly: true,
        path: "/refresh_token"
    })

    res.send({
        access_token: createAccessToken(user),
        user: data
    })
}

const refreshToken = async (req, res) => {
    const token = req.cookies.jid

    if (!token) {
        return res.send({ access_token: "" })
    }

    let payload = null
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
        console.log(err)
        return res.send({ access_token: "" })
    }

    const {
        rows: [user]
    } = await db.getToken([payload.userId])

    if (!user) {
        return res.send({ access_token: "" })
    }

    if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ access_token: "" })
    }

    res.cookie("jid", createRefreshToken(user), {
        httpOnly: true,
        path: "/refresh_token"
    })

    return res.send({ access_token: createAccessToken(user) })
}

const revokeToken = async (req, res) => {
    const { userId } = req.body
    await db.updateToken([userId])

    res.send(true)
}

const logout = (_req, res) => {
    res.clearCookie("jid", { httpOnly: true, path: "/refresh_token" })
    res.send(true)
}

const me = async (_req, res) => {
    const { payload } = res.locals

    const {
        rows: [user]
    } = await db.findUserById([payload.userId])

    res.send(user)
}

const bye = (_req, res) => {
    res.send(`your user id is: ${res.locals.payload.userId}`)
}

module.exports = {
    register,
    login,
    logout,
    refreshToken,
    revokeToken,
    me,
    bye
}
