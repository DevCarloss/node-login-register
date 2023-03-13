const mysql = require('mysql2')
const dotenv = require('dotenv').config()

// Conexao Banco de dados

const conexao_db = mysql.createConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE
})

module.exports = conexao_db