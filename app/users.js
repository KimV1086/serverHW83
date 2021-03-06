const express = require('express');

const User = require('../models/User');


const router = express.Router();


router.post('/', async (req, res) => {
  const user = new User(req.body);

  user.generateToken();

  try {
    await user.save();
    return res.send({token: user.token})
  } catch (error) {
    return res.status(400).send(error)
  }
});

router.post('/sessions', async (req, res) => {
  const user = await User.findOne({username: req.body.username});

  if (!user) {
    return res.status(400).send({error: 'Username/password incorrect'})
  }

  const isMatch = user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({error: 'Username/password incorrect'})
  }

  user.generateToken();

  await user.save();

  res.send({token: user.token})
});


module.exports = router;