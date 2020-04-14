const { sign } = require("jsonwebtoken")
const timespan = require("jsonwebtoken/lib/timespan")

exports.createRefreshToken = ({ id: userId, tokenVersion }) =>
    sign({ userId, tokenVersion }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    })

exports.createAccessToken = ({ id: userId }) => {
    const exp = timespan("15m")

    return {
        token: sign({ userId, exp }, process.env.ACCESS_TOKEN_SECRET),
        expiresIn: exp,
    }
}
