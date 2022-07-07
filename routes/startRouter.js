const express = require('express');
const router = express.Router();

var path = require("path");
const cors = require("./cors");
const authenticate = require('../authenticate');
const User = require('../models/users');
const Comments = require('../models/comments');
router.use(express.json());

router.options("*", cors.corsWithOptions, (req, res) => { 
    res.sendStatus(200)
});
router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
  });

router.get('/publications/:usuario', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    User.findById(req.params.usuario)  
    .populate({
        path: 'start',
        populate: { path: 'userId' }
    })
    .populate({ 
        path: 'start',
        populate: { path: 'videoId' }
    })
    .populate({
        path: 'start',
        populate: { path: 'imageId' }
    })
    .populate({
        path: 'start.commento',
        populate: { path: 'author' }
    })
    .then(user => {
        if (!user) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({
                err: err,
                status: "Ha ocurrido un error en el registro. Intente otra vez"
            });
            return;
        } else {
            var started = user.start;
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(started);
        }
    })
})
module.exports = router
