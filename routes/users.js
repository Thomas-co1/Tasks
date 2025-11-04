const express = require('express');
const router = express.Router();
const { User, Task } = require('../Model');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // ne pas renvoyer les mots de passe
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

/* GET user by id */
router.get('/:id', async function(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Task,
        attributes: ['id', 'titre', 'done', 'datetime']
      }]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

/* POST create user */
router.post('/', async function(req, res, next) {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }

    const user = await User.create({
      username,
      email,
      password, // TODO: hash le mot de passe avant de sauvegarder (bcrypt)
      firstName,
      lastName
    });

    // Ne pas renvoyer le mot de passe
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    next(error);
  }
});

/* PATCH update user */
router.patch('/:id', async function(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { username, email, password, firstName, lastName } = req.body;
    
    await user.update({
      ...(username && { username }),
      ...(email && { email }),
      ...(password && { password }), // TODO: hash le mot de passe
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName })
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    next(error);
  }
});

/* DELETE user */
router.delete('/:id', async function(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted', id: userId });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
