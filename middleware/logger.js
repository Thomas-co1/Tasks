const fs = require('fs');
const path = require('path');


async function loggers(req, res, next) {
    const logDir = path.join(__dirname, '../logs');

    // Nom du fichier : YYYY-MM-DD.log
    const today = new Date().toISOString().slice(0, 10);
    const logFile = path.join(logDir, `${today}.log`);

    // Crée le fichier s'il n'existe pas déjà
    if (!fs.existsSync(logFile)) {
        fs.writeFileSync(logFile, '', 'utf8');
        console.log(`Fichier créé : ${logFile}`);
    }

    // Prépare la ligne de log
    const logLine = `${req.ip} | ${req.method} | ${req.originalUrl} | ${res.statusCode}\n`;
    fs.appendFileSync(logFile, logLine, 'utf8');
    next();
}

module.exports = loggers;