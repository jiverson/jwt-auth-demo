const { Pool, Client } = require("pg")
const pool = new Pool()

// pool.query("SELECT NOW()", (err, res) => {
//     console.log(err, res)
//     pool.end()
// })

// const client = new Client()
// client.connect()

// client.query("SELECT NOW()", (err, res) => {
//     console.log(err, res)
//     client.end()
// })

module.exports = {
    query: (sqlStatement, params) => pool.query(sqlStatement, params)
}
