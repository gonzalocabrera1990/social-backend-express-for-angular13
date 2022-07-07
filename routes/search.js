const express = require('express');
var User = require('../models/users');
const routerSearch = express.Router();
const cors = require('./cors');
var authenticate = require('../authenticate');
const { scopeRegex } = require('../helpers/libs');

routerSearch.use(express.json());

routerSearch.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

routerSearch.get('/search', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  if (req.query.q) {
    const regex = new RegExp(scopeRegex(req.query.q), 'gi');
    User.find({ firstname: regex }, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
      }
    })

  } else {
    User.find({}, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
      }
    })
  }
})
module.exports = routerSearch;