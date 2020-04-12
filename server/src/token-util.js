const { sign } = require("jsonwebtoken")
const timespan = require("jsonwebtoken/lib/timespan")

exports.createRefreshToken = ({ id: userId, tokenVersion }) =>
    sign({ userId, tokenVersion }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })

exports.createAccessToken = ({ id: userId }) =>
    sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    })
