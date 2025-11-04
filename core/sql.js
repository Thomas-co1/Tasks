const mysql = require('mysql2/promise');
const json = require('body-parser').json();

function getConnection() {
    return mysql.createConnection({
        host: '127.0.0.1',
        user: 'admin',
        password: 'toto',
        database: 'taches',
        multipleStatements: true
    });
}

function verifID(id, res) {
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID must be a number' });
        return false;
    }
    return true;
}

function verifyDatetime(datetime, res) {
    // Regex pour vérifier le format 'YYYY-MM-DD HH:MM:SS'
    const regex = /^\d{4}-\d{2}-\d{2}([ T])\d{2}:\d{2}:\d{2}(\.\d+)?(Z)?$/;
    if (!regex.test(datetime)) {
        res.status(400).json({ error: "'datetime' must be in the format 'YYYY-MM-DD HH:MM:SS'" });
        return false;
    }
    return true;
}

function verifDone(done, res) {
    if (done !== 0 && done !== 1) {
        res.status(400).json({ error: "'done' must be 0 or 1" });
        return false;
    }
    return true;
}


module.exports = { getConnection, verifID, verifyDatetime, verifDone };