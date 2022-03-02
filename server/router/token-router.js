const express = require('express');
const router = express.Router();
const path = require('path');

const jwt = require('jwt-simple');
const secret = process.env.SECRET || 'xyz';

const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });

const mongo = require('../db/conn');
const { validateEmail } = require('../validation/validator');

const DEFAULT_DAILY_CALORIE_LIMIT = 2100;

router.get('/login', (req, res) => {
  if(req.cookies && req.cookies['calorie-token']) res.redirect('/');
  res.render(path.join(__dirname,'../views/login.ejs'));
});
router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect('/login');
});
router.post('/token', urlEncodedParser, validateEmail, (req, res) => {
  if(req.cookies && req.cookies['calorie-token']) res.redirect('/');
  if(req.body && req.body.email) {

    mongo.getDb()
                .collection("users")
                .findOne({email: req.body.email})
                .then(function(result){
                  if(!result) {
                    mongo.getDb()
                    .collection("users")
                    .insertOne({role: "user", email: req.body.email, dailyLimit: DEFAULT_DAILY_CALORIE_LIMIT});
                  }
                });

    let payload = { email: req.body.email };
    let token = jwt.encode(payload, secret);
    res.cookie('calorie-token', token,  { maxAge: 900000, httpOnly: true }).redirect('/');

  } else {
    res.status(400).send("Invalid request");
  }
});

module.exports = router;