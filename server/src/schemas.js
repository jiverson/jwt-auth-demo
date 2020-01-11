const Joi = require("@hapi/joi")

const usersDataSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required(),
    password: Joi.string()
        .min(7)
        .alphanum()
        .required()
})

module.exports = {
    "/register": usersDataSchema,
    "/login": usersDataSchema
}
