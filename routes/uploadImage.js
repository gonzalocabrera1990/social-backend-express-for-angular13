const express = require("express");
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const cors = require("./cors");
var authenticate = require("../authenticate");
const User = require('../models/users');
const Imagen = require('../models/image');
const Video = require('../models/video');
const Story = require('../models/story');
const Comment = require('../models/comments');
const { randomNumber } = require('../helpers/libs');
router.use(express.json());

let random = randomNumber(30) + Date.now();
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/upload/temp'),
    filename: (req, file, cb) => {
        cb(null, random + path.extname(file.originalname));
    }

});

const upload = multer({
    storage,
    dest: path.join(__dirname, '../public/upload/temp')
}).single('image');

router.use(
    upload
)

router.options("*", cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
});


router.post("/removeimage", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    Imagen.findById(req.body.imageid)
    .then(imagen =>{
        let pathfile = path.join(__dirname, '../public/', imagen.filename)
        fs.unlink(pathfile, (err) => {
            if (err) {
                // other errors, e.g. maybe we don't have enough permission
                console.error("Error occurred while trying to remove file");
            } else {
                Comment.deleteMany({image: imagen._id})
                .then(com =>{
                    Imagen.deleteOne({_id: req.body.imageid})
                    .then(img =>{
                        console.log("delete completed", img);
                    })
                })
            }
        })
    })
    .then(result =>{
        User.findById(req.body.userid)
        .then(user => {
           let indImg = user.imagesWall.findIndex(item => item._id == req.body.imageid);
            user.imagesWall.splice(indImg, 1);
            user.save()
            .then(resp =>{
                let foll = resp.followers.map(f => {
                    User.findByIdAndUpdate(f.id,
                        {$pull: {start: {imageId: req.body.imageid}}},
                        {safe: true, upsert: true},
                        function(err, doc) {
                            if(err){
                            console.log(err);
                            }else{
                            console.log("works");
                            }
                        }
                    );
                })
                return resp
            })
                .then(result => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(result);
                });
            })
    })
    .catch((err) => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
    });
})

router.post("/removevideo", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    Video.findById(req.body.imageid)
    .then(video =>{
        let fileRename = video.filename.split('#')[0]
        let pathfile = path.join(__dirname, '../public/', fileRename)
        fs.unlink(pathfile, (err) => {
            if (err) {
                console.error("Error occurred while trying to remove file");
            } else {
                console.info(`removed`);
                Comment.deleteMany({image: video._id})
                .then(com =>{
                    Video.deleteOne({_id: req.body.imageid})
                    .then(img =>{
                        console.log("delete compleat", img);
                    })
                })
            }
        })
    })
    .then(result =>{
        User.findById(req.body.userid)
        .then(user => {
           let indImg = user.videosWall.findIndex(item => item._id == req.body.imageid);
            user.videosWall.splice(indImg, 1);
            user.save()
            .then(resp =>{
                let foll = resp.followers.map(f => {
                    User.findByIdAndUpdate(f.id,
                        {$pull: {start: {videoId: req.body.imageid}}},
                        {safe: true, upsert: true},
                        function(err, doc) {
                            if(err){
                            console.log(err);
                            }else{
                                console.log("works");
                            }
                        }
                    );
                })
                return resp
            })
                .then(result => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(result);
                });
            })
    })
    .catch((err) => {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
    });
})

router.post("/story-post/:ID", cors.corsWithOptions,(req, res, next) => {
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".gif" ||
        ext === ".ico" ||
        ext === ".mp4" ||
        ext === ".ogv" ||
        ext === ".mkv" ||
        ext === ".avi" ||
        ext === ".mpg" ||
        ext === ".flv" ||
        ext === ".fla" ||
        ext === ".3gp" ||
        ext === ".m4v" ||
        ext === ".mov" 
    ) {
        Story.create({ filename: `upload/temp/${random}${ext}`, userData: req.params.ID, duration: req.body.duration })
            .then((img) => {
                if (img) {
                    img.comments = img._id;
                    img.save((err, imge) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader("Content-Type", "application/json");
                            res.json({
                                err: err,
                                status: "No se guardo imagen"
                            });
                            return;
                        } else {
                            User.findById(req.params.ID)
                                .then((user) => {
                                    if (!user) {
                                        res.statusCode = 500;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json({
                                            err: err,
                                            status: "No se encontro usuario"
                                        });
                                        return;
                                    } else {
                                        user.stories.unshift(img._id)
                                        user.save()
                                            .then((usuario) => {
                                                res.json({ message: 'bien ahi' })
                                            })
                                    }
                                })
                        }
                    })
                }
            })
            .catch((err) => {
                return next(err);
            })
        random = randomNumber(30) + Date.now();

    } else {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
    }
});
router.post("/story-view/:userID/:image", cors.corsWithOptions,(req, res, next) => {
    Story.findById(req.params.image)
    .then( h => {
        let view = h.views.some( v => v == req.params.userID)
        if(!view) {
            h.views.unshift(req.params.userID)
            h.save()
            .then( i => {
                res.json({ message: 'bien ahi' })
            })
        }
        return;
    })
    .catch((err) => {
        return next(err);
    })
 });

router.post("/profile-image-post/change/:ID", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".gif" ||
        ext === ".ico" 
    ) {
        User.findOne({ username: req.params.ID })
            .then((user) => {
                 if (req.file) user.image.filename = `upload/temp/${random}${ext}`;
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
                        res.json({ message: 'bien ahi' })
                        random = randomNumber(30) + Date.now();
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            });

    } else {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
    }
});

router.post("/imageswall/:ID", cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".gif" ||
        ext === ".ico" 
    ) {
        Imagen.create({ filename: `upload/temp/${random}${ext}`, userData: req.params.ID })
            .then((img) => {
                if (img) {
                    img.comments = img._id;
                    img.save((err, imge) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader("Content-Type", "application/json");
                            res.json({
                                err: err,
                                status: "No se guardo imagen"
                            });
                            return;
                        } else {
                            User.findById(req.params.ID)
                                .then((user) => {
                                    if (!user) {
                                        res.statusCode = 500;
                                        res.setHeader("Content-Type", "application/json");
                                        res.json({
                                            err: err,
                                            status: "No se encontro usuario"
                                        });
                                        return;
                                    } else {
                                        user.imagesWall.unshift(img._id)
                                        user.save()
                                            .then((usuario) => {
                                                for (let u = 0; u < usuario.followers.length; u++) {
                                                    var followerIds = usuario.followers[u].id;
                                                    User.findById(followerIds)
                                                        .then(fol => {
                                                            fol.start.unshift({
                                                                imageId: img._id,
                                                                userId: usuario._id,
                                                                comments: img._id
                                                            })
                                                            fol.save((err, user) => {
                                                                if (err) {
                                                                    res.statusCode = 500;
                                                                    res.setHeader("Content-Type", "application/json");
                                                                    res.json({
                                                                        err: err,
                                                                        status: "Ha ocurrido un error en el registro. Intente otra vez"
                                                                    });
                                                                } else {
                                                                    return true;
                                                                }
                                                            })
                                                        })
                                                }
                                            })
                                    }
                                })
                        }
                    })
                }
            })
            .catch((err) => {
                return next(err);
            })
        res.json({ message: 'bien ahi' })
        random = randomNumber(30) + Date.now();

    } else if (
        ext === ".mp4" ||
        ext === ".ogv" ||
        ext === ".mkv" ||
        ext === ".avi" ||
        ext === ".mpg" ||
        ext === ".flv" ||
        ext === ".fla" ||
        ext === ".3gp" ||
        ext === ".m4v" ||
        ext === ".mov" 
    ) {
        Video.create({ filename: `upload/temp/${random}${ext}#t=3.0`, userData: req.params.ID })
        .then((vid) => {
            if (vid) {
                vid.comments = vid._id;
                vid.save((err, video) => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.json({
                            err: err,
                            status: "No se guardo imagen"
                        });
                        return;
                    } else {
                        User.findById(req.params.ID)
                            .then((user) => {
                                if (!user) {
                                    res.statusCode = 500;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json({
                                        err: err,
                                        status: "No se encontro usuario"
                                    });
                                    return;
                                } else {
                                    user.videosWall.unshift(vid._id)
                                    user.save()
                                        .then((usuario) => {
                                            for (let u = 0; u < usuario.followers.length; u++) {
                                                var followerIds = usuario.followers[u].id;
                                                User.findById(followerIds)
                                                    .then(fol => {
                                                        fol.start.unshift({
                                                            videoId: vid._id,
                                                            userId: usuario._id,
                                                            comments: vid._id
                                                        })
                                                        fol.save((err, user) => {
                                                            if (err) {
                                                                res.statusCode = 500;
                                                                res.setHeader("Content-Type", "application/json");
                                                                res.json({
                                                                    err: err,
                                                                    status: "Ha ocurrido un error en el registro. Intente otra vez"
                                                                });
                                                            } else {
                                                                return true;
                                                            }
                                                        })
                                                    })
                                            }
                                        })
                                }
                            })
                    }
                })
            }
        })
        .catch((err) => {
            return next(err);
        })
    res.json({ message: 'bien ahi' })
    random = randomNumber(30) + Date.now();
    } else {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
    }
})

router.get('/view/imagenwall/:idimg', cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Imagen.findOne({_id: req.params.idimg})
        .populate("userData")
        .populate("likes")
        .populate("comments")
        .then(image => {
            if(!image){
                Video.findOne({_id: req.params.idimg})
                .populate("userData")
                .populate("likes")
                .populate("comments")
                .then(vid => {
                    if(!vid){
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.json({ err: vid });
                    } else {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(vid);
                    }
                })

            } else {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(image);
            }
        })
        .catch((err) => {
            console.log(err);
        });
})
module.exports = router;