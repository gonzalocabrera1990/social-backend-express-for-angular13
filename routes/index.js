var express = require('express');
var path = require('path');
var app = express();
var router = express.Router();
var User = require("../models/users");
const cors = require("./cors");
var authenticate = require("../authenticate");
router.use(express.json());

app.get('/users', function (req, res, next) {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});
router.get('/signup', function (req, res, next) {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

router.put("/settings/:userID", cors.corsWithOptions, (req, res, next) => {
  User.findById(req.params.userID)
    .then(user => {
      if (!user._id.equals(req.params.userID)) {
        var err = new Error("You are not authorized to update this data!");
        err.status = 403;
        return next(err);
      } else {
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.body.phrase) user.phrase = req.body.phrase;
        user.publicStatus = req.body.status;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({
              err: err,
              status: "Ha ocurrido un error en el registro. Intente otra vez"
            });
            return;
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({
              success: true,
              status: "Registro Exitoso! Vuelve para iniciar sesion"
            });
          }
        })
      }
    })
})

module.exports = router;