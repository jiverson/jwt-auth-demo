const db = require("./db")
const { hash, compare } = require("bcryptjs")
const { verify } = require("jsonwebtoken")

const { createRefreshToken, createAccessToken } = require("./token-util")

const invalidCredentials = (res) =>
    res.status(401).json({
        status: "failed",
        error: "Your email or your password was entered incorrectly.",
    })

exports.register = async (req, res) => {
    const { email, password } = req.body
    const hashedPassword = await hash(password, 12)

    const {
        rows: [data],
    } = await db.createUser([email, hashedPassword])

    res.send(data)
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    const {
        rows: [user],
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
    const { token: access_token, expiresIn } = createAccessToken(user)

    res.cookie("jid", createRefreshToken(user), {
        httpOnly: true,
        path: "/refresh_token",
    })

    res.send({
        access_token,
        expiresIn,
        user: data,
    })
}

exports.refreshToken = async (req, res) => {
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
        rows: [user],
    } = await db.getToken([payload.userId])

    if (!user) {
        return res.send({ access_token: "" })
    }

    if (user.tokenVersion !== payload.tokenVersion) {
        return res.send({ access_token: "" })
    }

    // TODO: Is this something needed?
    // res.cookie("jid", createRefreshToken(user), {
    //     httpOnly: true,
    //     path: "/refresh_token"
    // })

    // omit password
    const { password: removed, tokenVersion, ...data } = user
    const { token: access_token, expiresIn } = createAccessToken(user)

    return res.send({
        access_token,
        expiresIn,
        user: data,
    })
}

exports.revokeToken = async (req, res) => {
    const { userId } = req.body
    await db.updateToken([userId])

    res.send(true)
}

exports.logout = (_req, res) => {
    res.clearCookie("jid", { httpOnly: true, path: "/refresh_token" })
    res.send(true)
}

exports.profile = async (_req, res) => {
    const { payload } = res.locals

    const {
        rows: [user],
    } = await db.findUserById([payload.userId])

    res.send(user)
}

exports.me = (_req, res) => {
    res.send(`your user id is: ${res.locals.payload.userId}`)
}
