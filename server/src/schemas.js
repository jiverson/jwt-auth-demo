const joi = require("@hapi/joi")

const usersDataSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(7).alphanum().required(),
})

module.exports = {
    "/register": usersDataSchema,
    "/login": usersDataSchema,
}
