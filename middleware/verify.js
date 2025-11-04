const fs = require('fs');
const path = require('path');

async function verifyToken(req, res) {
    console.log(req.headers['authorization']);
    const bearer = req.headers['authorization'];
    if (!bearer.startsWith('Bearer ')) {
        return;
    }

    const token = bearer.split(' ')[1];

    jwt.verify(token, process.env.JWT_PRIVATE_TOKEN, (err, payload) => {
        console.log("error", err);
        console.log("payload", payload);
    });
    
    
    



}

module.exports = verifyToken;