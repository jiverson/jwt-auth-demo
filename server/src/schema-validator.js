const Joi = require("@hapi/joi")
const schemas = require("./schemas")

const supportedMethods = ["post", "put"]
const validationOptions = {
    abortEarly: false, // abort after the last validation error
    allowUnknown: true, // allow unknown keys that will be ignored
    stripUnknown: true // remove unknown keys from the validated data
}

module.exports = (useJoiError = false) => (req, res, next) => {
    const route = req.route.path
    const method = req.method.toLowerCase()
    const schema = schemas[route]

    if (supportedMethods.includes(method) && schema) {
        return Joi.validate(
            req.body,
            schema,
            validationOptions,
            (err, data) => {
                if (!err) {
                    // Replace req.body with the data after Joi validation
                    req.body = data
                    return next()
                }

                const joiError = {
                    status: "failed",
                    error: {
                        original: err._object,
                        // fetch only message and type from each error
                        details: err.details.map(({ message, type }) => ({
                            message: message.replace(/['"]/g, ""),
                            type
                        }))
                    }
                }

                const customError = {
                    status: "failed",
                    error:
                        "Invalid request data. Please review request and try again."
                }

                // Send back the JSON error response
                res.status(422).json(useJoiError ? joiError : customError)
            }
        )
    }

    next()
}
