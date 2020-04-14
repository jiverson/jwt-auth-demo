const { verify } = require("jsonwebtoken")

module.exports = (req, res, next) => {
    const authorization = req.headers["authorization"]

    if (!authorization) {
        return res.status(401).json({
            status: "failed",
            error: "You are not authorized.",
        })
    }

    try {
        const token = authorization.split(" ")[1]
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET)
        res.locals.payload = payload
    } catch (err) {
        // console.log(err)
        // throw new Error("not authenticated")
        return res.status(403).json({
            status: "failed",
            error: "You are not authenticated.",
        })
    }

    return next()
}
