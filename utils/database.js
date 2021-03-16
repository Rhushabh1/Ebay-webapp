const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',     //your postgres username
    host: '127.0.0.1', 
    database: 'eshop', //your local database 
    password: '12345', //your postgres user password
    port: 5432, //your postgres running port
});

pool.connect();


module.exports = pool;