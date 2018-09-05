var mysql = require('mysql');
var dbConfig = {
    host: '127.0.0.2',
    user: 'root',
    password: 'root123',
    database: 'holiday_project'
};
const pool = mysql.createPool(dbConfig);
module.exports = pool;