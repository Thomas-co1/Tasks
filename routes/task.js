const express = require('express');
const router = express.Router();
const sql = require('../core/sql');




/* GET tasks listing. */
router.get('/', async function(req, res, next) {
    const connection = await sql.getConnection();
    const [result, fields] = await connection.query('SELECT * FROM task');

    //filtre en fonction de la query string ?done=true ou ?done=false en requête sql
    if (req.query.done) {
        const done = req.query.done === 'true' ? 1 : 0;
        const [filteredResult] = await connection.query('SELECT * FROM task WHERE done = ?', [done]);
        return res.json(filteredResult);
    }

    //filtrer en fonction du titre avec ?titre=quelquechose
    if (req.query.titre) {
        const titre = `%${req.query.titre}%`;
        const [filteredResult] = await connection.query('SELECT * FROM task WHERE titre LIKE ?', [titre]);
        return res.json(filteredResult);
    }

    //fonction filtrant les retards
    if (req.query.retard) {
        const date = new Date();
        //comparaison de datetime avec ma variable date en SQL
        //si retard=false, affiche les task n'étant pas en retard ou finies
        if (req.query.retard === 'false') {
            const [filteredResult] = await connection.query('SELECT * FROM task WHERE datetime >= ? OR done = 1', [date]);
            return res.json(filteredResult);
        }
        else{
            const [filteredResult] = await connection.query('SELECT * FROM task WHERE datetime < ? AND done = 0', [date]);
            return res.json(filteredResult);
        }
    }

    const page = parseInt(req.query.page) || 1; // page par défaut 1
    const limit = 10; // 10 éléments par page
    const offset = (page - 1) * limit;

    // Ajouter LIMIT et OFFSET à ta requête SQL existante
    const [paginatedResult] = await connection.query('SELECT * FROM task LIMIT ? OFFSET ?', [limit, offset]);
    res.json(paginatedResult);

});

router.get('/:id', async function(req, res, next) {
    if (sql.verifID(req.params.id, res) === false) {
        return;
    }
    const connection = await sql.getConnection();
    const [result, fields] = await connection.query('SELECT * FROM task WHERE id =?', [req.params.id]);
    res.json(result);
});

router.post('/', async function(req, res, next) {
    const connection = await sql.getConnection();
    console.log(req.body);

    if (sql.verifDone(req.body.done, res) === false || sql.verifyDatetime(req.body.datetime, res) === false) {
        return;
    }

    const [result] = await connection.query(
        'INSERT INTO task (done, datetime, titre, description) VALUES (?, ?, ?, ?)', [req.body.done, req.body.datetime, req.body.titre, req.body.description]
    );
    await connection.end();
    

    res.json({
        id: result.insertId,
        done: req.body.done,
        datetime: req.body.datetime,
        titre: req.body.titre,
        description: req.body.description
    });
});
 
router.patch('/:id', async function(req, res, next) {
    //si id est autre chose qu'un nombre, erreur 400
    if ((sql.verifID(req.params.id, res) === false) || (sql.verifDone(req.body.done, res) === false) || (sql.verifyDatetime(req.body.datetime, res) === false)) {
        return;
    } else {
        await connection.query('UPDATE task SET done = ?, datetime = ?, titre = ?, description = ? WHERE id = ?', [req.body.done, req.body.datetime, req.body.titre, req.body.description, req.params.id]);
        res.json({ id: req.params.id, done: req.body.done, datetime: req.body.datetime, titre: req.body.titre, description: req.body.description });

        await connection.end();
    }
});

router.delete('/:id', async function(req, res, next) {
    if (sql.verifID(req.params.id) === false) {
        return;
    }
    const connection = await sql.getConnection();
    await connection.query('DELETE FROM task WHERE id = ?', [req.params.id]);
    res.json({ id: req.params.id });
});



module.exports = router;
