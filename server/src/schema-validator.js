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
        const { error, value } = schema.validate(req.body, validationOptions)

        if (!error) {
            req.body = value
            return next()
        }

        const joiError = {
            status: "failed",
            error: {
                original: error._object,
                // fetch only message and type from each error
                details: error.details.map(({ message, type }) => ({
                    message: message.replace(/['"]/g, ""),
                    type
                }))
            }
        }

        const customError = {
            status: "failed",
            error: "Invalid request data. Please review request and try again."
        }

        // Send back the JSON error response
        res.status(422).json(useJoiError ? joiError : customError)
    }

    next()
}
