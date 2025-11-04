const express = require('express');
const {Op} = require('sequelize');

const bcrypt = require('bcrypt');

const router = express.Router();

const {Users} = require('../Model');

const jwt = require('jsonwebtoken');


router.post('/register', (req, res) => {
    //prend Email, password et confimPassword depuis le body
    const {email, password, confirmPassword, username, name, } = req.body;
    //vérifier si adresse email valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({error: 'Email invalide'});
    }
    //vérifier si password et confirmPassword sont identiques
    if (password !== confirmPassword) {
        return res.status(400).json({error: 'Les mots de passe ne correspondent pas'});
    }
    //vérifier si password > 8 caractères
    if (password.length < 8) {
        return res.status(400).json({error: 'Le mot de passe doit contenir au moins 8 caractères'});
    }
    //Chiffrement de MDP via bcrypt
    const crypted = bcrypt.hashSync(password, 10);

    //créer un user avec sequelize
    const newUser = Users.create({email, password: crypted, username, name});

    return res.status(201).json({message: 'Utilisateur créé avec succès'});
});

router.post('/login', (req, res) => {
    //vérifier que le compte existe
    //OK => status 200
    //NOK => status 403
    const {email, password, username, name} =  req.body;

    //vérification de l'existence de l'utilisateur
    const user = Users.findOne({where: {[Op.or]: [{email}, {username}]}});
    if (!user) {
        return res.status(403).json({error: 'Utilisateur ou mot de passe incorrect'});
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(403).json({error: 'Utilisateur ou mot de passe incorrect'});
    }

    const token = jwt.sign(
        {
            userId: user.id,
        },
        process.env.JWT_PRIVATE_TOKEN,
        {expiresIn: '1h'}
    );

    return res.status(200).json({'token': token});
});



module.exports = router;