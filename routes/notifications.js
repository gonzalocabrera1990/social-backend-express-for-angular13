const express = require("express");
var User = require("../models/users");
const router = express.Router();
const cors = require("./cors");
var authenticate = require("../authenticate");

router.use(express.json());

router.options("*", cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
});

router.route('/following-request/:followerID/:notiId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        User.findByIdAndUpdate(req.body.followingId, {
            $set: req.params
        }, { new: true })
            .then(user => {
                if (!user._id.equals(req.body.followingId)) {

                    var err = new Error("You are not authorized to update this data!");
                    err.status = 403;
                    return next(err);
                } else {
                    if (req.body.action === false) {
                        user.notifications.id(req.params.notiId).remove();
                    } else {
                        user.followers.push({ id: req.params.followerID })
                        user.notifications.id(req.params.notiId).remove();
                    }
                    user.save((err, user) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader("Content-Type", "application/json");
                            res.json({
                                err: err,
                                status: "Ha ocurrido un error en la solicitud. Intente otra vez"
                            });
                            return;
                        } else {
                            User.findById(req.params.followerID)
                                .then(usuario => {

                                    if (req.body.action === true) usuario.following.push({ id: user._id })
                                    usuario.save()
                                        .then(data => {

                                            res.statusCode = 200;
                                            res.setHeader("Content-Type", "application/json");
                                            res.json({
                                                success: true,
                                                status: "Se ejecuto la solicitud"
                                            });
                                        })
                                })
                        }
                    })
                }
            }
        )
    })


router.route('/user-notifications/get/:iduser')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        User.findOne({ username: req.params.iduser })
            .populate('notifications.followingId')
            .then(user => {
                if (user != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(user.notifications);
                } else {
                    err = new Error('User  not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })


router.route('/following-user/send/:followerId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        User.findById(req.params.followerId)
            .then((user) => {
                if (user != null) {
                    user.notifications.push(req.body);
                    user.save()
                        .then((user) => {
                            User.findById(user._id)
                                .populate('notifications.followingId')
                                .then((user) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(user);
                                })
                        }, (err) => next(err));
                }
                else {
                    err = new Error('User  not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })


router.route('/all/readtrue/:userID')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        User.findOne({ _id: req.params.userID })
            .then(user => {
                if (!user._id.equals(req.params.userID)) {
                    const Err = new Error("No estas autorizado a realizar esta accion");
                    Err.statusCode = 500;
                    return next(Err)
                } else {
                    for (let i = 0; i < user.notifications.length; i++) {
                        user.notifications[i].readstatus = true
                    }
                    user.save()
                        .then(response => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.json(response);
                        })
                }
        })
    })
module.exports = router;