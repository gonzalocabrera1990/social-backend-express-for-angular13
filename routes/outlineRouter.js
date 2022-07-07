const express = require("express");
var User = require("../models/users");
const router = express.Router();
const cors = require("./cors");

router.use(express.json());

router.options("*", cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});
router.get("/get-outline-user/:usersID", cors.corsWithOptions, (req, res, next) => {
      User.findOne({ usuario: req.params.usersID })
      .populate('imagesWall')
      .populate('videosWall')
        .then(async (user) => {
          if (user.publicStatus) {
            const answerFalse = {
              message: "Esta cuenta es privada. Siguela para mirar su contenido",
              _id: user._id,
              firstname: user.firstname,
              lastname: user.lastname,
              image: user.image,
              phrase: user.phrase,
              following: user.following,
              followers: user.followers
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(answerFalse);
          }
          else {
            const answer = {
              _id: user._id,
              firstname: user.firstname,
              lastname: user.lastname,
              image: user.image,
              phrase: user.phrase,
              imagesWall: user.imagesWall,
              videosWall: user.videosWall,
              following: user.following,
              followers: user.followers
            }
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(answer);
          }
        })
        .catch(err => {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.json({ err: err });
        });
    }
  );

module.exports = router;