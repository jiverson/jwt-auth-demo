const { sign } = require("jsonwebtoken")

const createRefreshToken = ({ id: userId, tokenVersion }) =>
    sign({ userId, tokenVersion }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })

const createAccessToken = ({ id: userId }) =>
    sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    })

module.exports = {
    createRefreshToken,
    createAccessToken
}
