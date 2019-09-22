const { hash, compare, verify } = require("bcryptjs")
const db = require("./db")
const { createRefreshToken, createAccessToken } = require("./token-util")

const register = async (req, res) => {
    const { email, password } = req.body
    const hashedPassword = await hash(password, 12)

    const sqlStatement = `
		INSERT INTO users (email, password, created_at, updated_at)
		VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id`

    const {
        rows: [data]
    } = await db.query(sqlStatement, [email, hashedPassword])

    res.send(data)
}

const login = async ({ email, password }) => {
    const { email, password } = req.body

    const sqlStatement = `
        SELECT id, email, password, token_version as "tokenVersion"
		FROM users
		WHERE (email = $1)
		ORDER BY id
		ASC LIMIT 1`

    const {
        rows: [user]
    } = await db.query(sqlStatement, [email])

    if (!user) {
        throw new Error("could not find user")
    }

    const valid = await compare(password, user.password)

    if (!valid) {
        throw new Error("bad password")
    }

    // omit password
    const { password: removed, tokenVersion, ...data } = user

    return {
        access_token: createAccessToken(user),
        refresh_token: createRefreshToken(user),
        user: data
    }
}

const refreshToken = async (token) => {
    const emptyToken = {
        access_token: "",
        refresh_token: ""
    }

    if (!token) {
        return emptyToken
    }

    let payload = null
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
        console.log(err)
        return emptyToken
    }

    const sqlStatement = `
        SELECT id, token_version as "tokenVersion"
		FROM users
		WHERE (id = $1)
		ORDER BY id
		ASC LIMIT 1`

    const {
        rows: [user]
    } = await db.query(sqlStatement, [payload.userId])

    if (!user) {
        return emptyToken
    }

    if (user.tokenVersion !== payload.tokenVersion) {
        return emptyToken
    }

    return {
        access_token: createAccessToken(user),
        refresh_token: createRefreshToken(user)
    }
}

const revokeToken = async ({ userId }) => {
    const sqlStatement = `
        UPDATE users
        SET token_version = token_version + 1
        WHERE id = $1;
    `

    await db.query(sqlStatement, [userId])
}

module.exports = {
    register,
    login,
    refreshToken,
    revokeToken
}
