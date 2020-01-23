const { Pool } = require("pg");
let ProperitesReader = require("properties-reader");
let properties = ProperitesReader("server.properties");

const pool = new Pool({
    user: properties.get("database.user.name"),
    host: properties.get("database.host"),
    database: properties.get("database.name"),
    password: properties.get("database.password"),
    port: properties.get("database.port")
})

module.exports = pool;