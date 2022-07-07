const express = require("express");
var User = require("../models/users");
const router = express.Router();
const cors = require("./cors");
var authenticate = require("../authenticate");

const { measure } = require('../helpers/libs');

router.use(express.json());

router.get('/:id', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    User.findById(req.params.id)
    .populate('stories')
    .populate({
        path : 'stories',
        populate : {
          path : 'userData'
        }
      })
    .then(u =>{
        const storyFilter = u.stories.filter( h => measure(h.timestamp) <= 24)
        return storyFilter;
    })
    .then( list =>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(list)
    })
    .catch(err => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      });
})

module.exports = router;