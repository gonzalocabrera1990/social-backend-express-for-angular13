const express = require("express");
var User = require("../models/users");
const Imagen = require('../models/image');
const Video = require('../models/video');
const router = express.Router();
const cors = require("./cors");
var passport = require("passport");
var authenticate = require("../authenticate");
const { getUsuario } = require('../helpers/libs');
router.use(express.json());

router.options("*", cors.corsWithOptions, (req, res) => {
  res.sendStatus(200);
});

router.get("/profile/:localid/:usersID", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    User.findOne({ usuario: req.params.usersID })
      .populate({
        path: 'followers',
        populate: {
          path: 'id'
        }
      })
      .populate('imagesWall')
      .populate('videosWall')
      .populate('stories')
      .then(user => {
        const test = req.params.localid
        if (user.publicStatus === false) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
          return;
        } else if (user.followers.some(f => f.id.usuario == req.params.localid ? true : false)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
          return;
        }
        else if (user.publicStatus === true) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({
            message: "Esta cuenta es privada. Siguela para mirar su contenido",
            publicStatus: user.publicStatus,
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            image: user.image,
            phrase: user.phrase,
            followers: user.followers,
            following: user.following,
            notifications: user.notifications,
            stories: []
          });
        }
      })
      .catch(err => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      });
  }
);

// router.get("/followers-notifications-return/:userId", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//   User.findById(req.params.userId)
//     .populate({
//         path : 'followers',
//         populate : {
//           path : 'id'
//         }
//       })
//     .then(user => {
//       res.statusCode = 200;
//       res.setHeader("Content-Type", "application/json");
//       res.json({
//         follow: user.followers,
//         notif: user.notifications
//       });
//     })
//     .catch(err => {
//       res.statusCode = 500;
//       res.setHeader("Content-Type", "application/json");
//       res.json({ err: err });
//     });
// }
// );
// router.get("/following/:userId", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//   User.findById(req.params.userId)
//   .populate({
//     path : 'following',
//     populate : {
//       path : 'id'
//     }
//   })
//     .populate({
//       path : 'following',
//       populate : {
//         path : 'id',
//         populate : {
//           path : 'stories',
//           populate : {
//             path : 'userData'
//           }
//         }
//       }
//     })
//     .then(user => {
//       res.statusCode = 200;
//       res.setHeader("Content-Type", "application/json");
//       res.json({
//         follow: user.following
//       });
//     })
//     .catch(err => {
//       res.statusCode = 500;
//       res.setHeader("Content-Type", "application/json");
//       res.json({ err: err });
//     });
// }
// );

router.get("/angular-followers/:userId", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  User.findById(req.params.userId)
    .populate({
        path : 'followers',
        populate : {
          path : 'id'
        }
      })
    .then(user => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(user.followers);
    })
    .catch(err => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    });
}
);

router.get("/angular-following/:userId", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  User.findById(req.params.userId)
  .populate({
    path : 'following',
    populate : {
      path : 'id'
    }
  })
    .populate({
      path : 'following',
      populate : {
        path : 'id',
        populate : {
          path : 'stories',
          populate : {
            path : 'userData'
          }
        }
      }
    })
    .then(user => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(user.following);
    })
    .catch(err => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    });
}
);

router.post("/signup", cors.corsWithOptions, (req, res, next) => {
  User.findOne({ username: req.body.username })
  .then(user => {
    if(user){
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        status: "Ya existe una cuenta con el e-mail elegido"
      });
    } else {
      User.register(
        new User({ username: req.body.username }),
        req.body.password,
        (err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({
              err: err,
              status: "Ha ocurrido un error de servidor. 500"
            });
          } else {
            let saveUser = getUsuario(req.body.username)
            saveUser.then((mira)=>{
              user.usuario = mira;
              user.image = { filename: 'images/perfildefault.jpg', likes: 0 };
              if (req.body.country) user.country = req.body.country;
              if (req.body.date) user.date = req.body.date;
              if (req.body.sex) user.sex = req.body.sex;
              user.save((err, user) => {
                if (err) {
                  res.statusCode = 500;
                  res.setHeader("Content-Type", "application/json");
                  res.json({
                    err: err,
                    status: "Ha ocurrido un error en el registro. Intente otra vez"
                  });
                  return;
                }
                passport.authenticate("local")(req, res, () => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({
                    success: true,
                    status: "Registro Exitoso! Vuelve para iniciar sesion"
                  });
                });
              });
            })
          }
        })
    }
  })
})


router.put("/settings/:userID", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  User.findById(req.params.userID)
    .then(user => {
      if (!user._id.equals(req.params.userID)) {
        var err = new Error("You are not authorized to update this data!");
        err.status = 403;
        return next(err);
      } else {
        let mostara = req.body.status == "" ? "req.body.status != .." : req.body.status == null ? "null" : req.body.status
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.body.phrase) user.phrase = req.body.phrase;
        if (req.body.status || req.body.status === false) user.publicStatus = req.body.status;
               
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

// router.post('/returnid/:loged', cors.corsWithOptions, (req, res, next) => {
//   Imagen.findOne({ filename: req.body.foto })
//     .then(item => {
//       let idImg = item._id;
//       res.statusCode = 200;
//       res.setHeader("Content-Type", "application/json");
//       res.json({ result: idImg });
//     })
//     .catch((err) => {
//       console.log(err);
//     })
// })

// router.post('/returnid-video/:loged', cors.corsWithOptions, (req, res, next) => {
//   Video.findOne({ filename: req.body.foto })
//   .then(item => {
//     let idImg = item._id;
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "application/json");
//     res.json({ result: idImg });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// })

router.post("/login", cors.corsWithOptions, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {

    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
    }
    req.logIn(user, err => {

      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: "Login Unsuccessful!",
          err: "Could not log in user!"
        });
      }
      var token = authenticate.getToken({ _id: req.user._id });

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: true,
        status: "Login Successful!",
        token: token,
        userdata: user
      });
    });
  })(req, res, next);
});

router.get("/checkJWTtoken", cors.corsWithOptions, (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT invalid!", success: false, err: info });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.json({ status: "JWT valid!", success: true, user: user });
    }
  })(req, res);
});

router.get("/logout", cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not logged in!");
    err.status = 403;
    next(err);
  }
});

// router.get("/facebook/token", passport.authenticate("facebook-token"), (req, res) => {
//     if (req.user) {
//       var token = authenticate.getToken({ _id: req.user._id });
//       res.statusCode = 200;
//       res.setHeader("Content-Type", "application/json");
//       res.json({
//         success: true,
//         token: token,
//         status: "You are successfully logged in!"
//       });
//     }
//   }
// );

router.get("/get-home-user/:userID", cors.corsWithOptions, authenticate.verifyUser,
  (req, res, next) => {
    User.findOne({ username: req.params.userID })
      .populate({
        path : 'notifications',
        populate : {
          path : 'followingId'
        }
      })
      .populate('imagesWall')
      .populate('videosWall')
      .populate('stories')
      .then((user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
      })
      .catch(err => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      });
  }
);
// router.get("/get-outline-user/:userID", cors.corsWithOptions,
//   (req, res, next) => {
//     User.findOne({ usuario: req.params.userID })
//       .populate('notifications.followingId')
//       .populate('imagesWall')
//       .then((user) => {
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "application/json");
//         res.json(user);
//       })
//       .catch(err => {
//         res.statusCode = 500;
//         res.setHeader("Content-Type", "application/json");
//         res.json({ err: err });
//       });
//   }
// );
module.exports = router;
