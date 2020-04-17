const { Pool, Client } = require("pg")
const pool = new Pool()

// const client = new Client()
// client.connect()

const createUser = `
    INSERT INTO users (email, password, created_at, updated_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING id;
`

const findUserByEmail = `
    SELECT id, email, password, token_version AS "tokenVersion"
    FROM users
    WHERE(email = $1)
    ORDER BY id
    ASC LIMIT 1;
`

const findUserById = `
    SELECT id, email
    FROM users
    WHERE (id = $1)
    ORDER BY id
    ASC LIMIT 1;
`

const getToken = `
    SELECT id, token_version AS "tokenVersion"
    FROM users
    WHERE (id = $1)
    ORDER BY id
    ASC LIMIT 1;
`

const updateToken = `
    UPDATE users
    SET token_version = token_version + 1
    WHERE id = $1;
`

module.exports = {
    query: (sqlStatement, params) => pool.query(sqlStatement, params),
    createUser: (params) => pool.query(createUser, params),
    findUserByEmail: (params) => pool.query(findUserByEmail, params),
    findUserById: (params) => pool.query(findUserById, params),
    getToken: (params) => pool.query(getToken, params),
    updateToken: (params) => pool.query(updateToken, params),
}
