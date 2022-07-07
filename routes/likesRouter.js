const express = require('express');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Imagen = require('../models/image');
const Video = require('../models/video');
const Likes = require('../models/likes');
const likeRouter = express.Router();
likeRouter.use(express.json());

// likeRouter.route('/get-i-like-it/:userid/:imgid')
// .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
// .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Imagen.findById(req.params.imgid)
//         .populate('likes')
//         .then(imagen => {
//             if (!imagen) {
//                 var err = new Error('No existe');
//                 err.status = 403;
//                 return next(err);
//             } else {
//                 let iterUser = imagen.likes;
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(iterUser);
//             }
//         })
// });
    
// likeRouter.route('/get-i-like-it-video/:userid/:imgid')
// .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
// .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Video.findById(req.params.imgid)
//         .populate('likes')
//         .then(imagen => {
//             if (!imagen) {
//                 var err = new Error('No existe');
//                 err.status = 403;
//                 return next(err);
//             } else {
//                 let iterUser = imagen.likes;
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(iterUser);
//             }
//         })
    
// });
 
// likeRouter.route('/post-i-like-it/:imageId')
// .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Likes.findOne({ user: req.user._id }, (err, like) => {
//         if (err) return next(err);
//         if (!like) {
//             Likes.create({ user: req.user._id })
//                 .then((like) => {
//                     like.image.push({ "_id": req.params.imageId });
//                     like.save()
//                         .then((like) => {
//                             Imagen.findById(req.params.imageId)
//                             .then(vid => {
//                                 if (!vid) {
//                                     res.statusCode = 404;
//                                     res.setHeader('Content-Type', 'application/json');
//                                     res.json("The user you are trying to find doesn't exist");
//                                 } else {
//                                     var resultImg = vid.likes.indexOf(req.user._id);
//                                     if (resultImg !== -1) {
//                                         vid.likes.splice(resultImg, 1)
//                                         vid.save()
//                                     } else {
//                                         vid.likes.push(req.body.id)
//                                         vid.save()
//                                     }
//                                 }
//                             })
//                             .then(en => {
//                                 Likes.findOne({ user: req.user._id })
//                                 .populate('user')
//                                 .populate('image')
//                                 .then((like) => {
//                                     res.statusCode = 200;
//                                     res.setHeader('Content-Type', 'application/json');
//                                     res.json(like);
//                                 })
//                             })
//                         })
//                         .catch((err) => {
//                             return next(err);
//                         });
//                 })
//                 .catch((err) => {
//                     return next(err);
//                 })
            
//         } else {
//             let existLike = like.image.includes(req.params.imageId)
//             if (existLike) {
//                 var index = like.image.indexOf(req.params.imageId);
//                     like.image.splice(index, 1);
//                     like.save()
//                     .then(like =>{
//                         Imagen.findById(req.params.imageId)
//                         .then(vid => {
//                             if (!vid) {
//                                 res.statusCode = 404;
//                                 res.setHeader('Content-Type', 'application/json');
//                                 res.json("The user you are trying to find doesn't exist");
//                             } else {
//                                 var resultImg = vid.likes.indexOf(req.user._id);
//                                     vid.likes.splice(resultImg, 1)
//                                     vid.save()
//                             }
//                         })
//                     })
//                     .then((like) => {
//                         Likes.findOne({ user: req.user._id })
//                             .populate('user')
//                             .populate('image')
//                             .then((like) => {
//                                 res.statusCode = 200;
//                                 res.setHeader('Content-Type', 'application/json');
//                                 res.json(like);
//                             })
//                     })
//                     .catch((err) => {
//                         return next(err);
//                     })
//             } else {
//                 like.image.push(req.params.imageId)
//                 like.save()
//                 .then(like =>{
//                     Imagen.findById(req.params.imageId)
//                     .then(vid => {
//                         if (!vid) {
//                             res.statusCode = 404;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json("The user you are trying to find doesn't exist");
//                         } else {
//                             vid.likes.push(req.body.id)
//                             vid.save()
//                         }
//                     })
//                 })
//                 .then((li) => {
//                     Likes.findOne({ user: req.user._id })
//                         .populate('user')
//                         .populate('image')
//                         .then((like) => {
//                             res.statusCode = 200;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json(like);
//                         })
//                 })
//                 .catch((err) => {
//                     return next(err);
//                 })
//             }
//         }
//     });
// })
// .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Likes.findOne({ user: req.user._id }, (err, like) => {
//         if (err) return next(err);
//         var index = like.image.indexOf(req.params.imageId);
//         if (index >= 0) {
//             like.image.splice(index, 1);
//             like.save()
//                 .then((like) => {
//                     Likes.findById(like._id)
//                         .populate('user')
//                         .populate('image')
//                         .then((like) => {
//                             res.statusCode = 200;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json(like);
//                         })
//                 })
//                 .catch((err) => {
//                     return next(err);
//                 })
//         } else {

//             res.statusCode = 404;
//             res.setHeader('Content-Type', 'text/plain');
//             res.end('Image ' + req.params._Id + 'not exist');
//         }
//     });
// });

// likeRouter.route('/post-i-like-it-video/:imageId')
// .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
// .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Likes.findOne({ user: req.user._id }, (err, like) => {
//         if (err) return next(err);
//         if (!like) {
//             Likes.create({ user: req.user._id })
//                 .then((like) => {
//                     like.image.push({ "_id": req.params.imageId });
//                     like.save()
//                         .then((like) => {
//                             Video.findById(req.params.imageId)
//                             .then(vid => {
//                                 if (!vid) {
//                                     res.statusCode = 404;
//                                     res.setHeader('Content-Type', 'application/json');
//                                     res.json("The user you are trying to find doesn't exist");
//                                 } else {
//                                     var resultImg = vid.likes.indexOf(req.user._id);
//                                     if (resultImg !== -1) {
//                                         vid.likes.splice(resultImg, 1)
//                                         vid.save()
//                                     } else {
//                                         vid.likes.push(req.body.id)
//                                         vid.save()
//                                     }
//                                 }
//                             })
//                             .then(en => {
//                                 Likes.findOne({ user: req.user._id })
//                                 .populate('user')
//                                 .populate('image')
//                                 .then((like) => {
//                                     res.statusCode = 200;
//                                     res.setHeader('Content-Type', 'application/json');
//                                     res.json(like);
//                                 })
//                             })
//                         })
//                         .catch((err) => {
//                             return next(err);
//                         });
//                 })
//                 .catch((err) => {
//                     return next(err);
//                 })
            
//         } else {
//             let existLike = like.image.includes(req.params.imageId)
//             if (existLike) {
//                 var index = like.image.indexOf(req.params.imageId);
//                     like.image.splice(index, 1);
//                     like.save()
//                     .then(like =>{
//                         Video.findById(req.params.imageId)
//                         .then(vid => {
//                             if (!vid) {
//                                 res.statusCode = 404;
//                                 res.setHeader('Content-Type', 'application/json');
//                                 res.json("The user you are trying to find doesn't exist");
//                             } else {
//                                 var resultImg = vid.likes.indexOf(req.user._id);
//                                     vid.likes.splice(resultImg, 1)
//                                     vid.save()
//                             }
//                         })
//                     })
//                     .then((like) => {
//                         Likes.findOne({ user: req.user._id })
//                             .populate('user')
//                             .populate('image')
//                             .then((like) => {
//                                 res.statusCode = 200;
//                                 res.setHeader('Content-Type', 'application/json');
//                                 res.json(like);
//                             })
//                     })
//                     .catch((err) => {
//                         return next(err);
//                     })
//             } else {
//                 like.image.push(req.params.imageId)
//                 like.save()
//                 .then(like =>{
//                     Video.findById(req.params.imageId)
//                     .then(vid => {
//                         if (!vid) {
//                             res.statusCode = 404;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json("The user you are trying to find doesn't exist");
//                         } else {
//                             vid.likes.push(req.body.id)
//                             vid.save()
//                         }
//                     })
//                 })
//                 .then((li) => {
//                     Likes.findOne({ user: req.user._id })
//                         .populate('user')
//                         .populate('image')
//                         .then((like) => {
//                             res.statusCode = 200;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json(like);
//                         })
//                 })
//                 .catch((err) => {
//                     return next(err);
//                 })
//             }
//         }
//     });
// })

likeRouter.route('/angular-get-i-like-it/:imgid')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Likes.findOne({ user: req.params.imgid})
    .populate('user')
    .then(imagen => {
            if (!imagen) {
                var err = new Error('No existe');
                err.status = 403;
                return next(err);
            } else {
                let iterUser = imagen;
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(iterUser);
            }
        })
})

likeRouter.route('/imagen-likes-angular/:imgid')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Imagen.findById(req.params.imgid)
        .populate('likes')
        .then(imagen => {
            if (!imagen) {
                var err = new Error('No existe');
                err.status = 403;
                return next(err);
            } else {
                let iterUser = imagen.likes;
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(iterUser);
            }
        })
});
likeRouter.route('/videos-likes-angular/:imgid')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Video.findById(req.params.imgid)
        .populate('likes')
        .then(imagen => {
            if (!imagen) {
                var err = new Error('No existe');
                err.status = 403;
                return next(err);
            } else {
                let iterUser = imagen.likes;
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(iterUser);
            }
        })
});

likeRouter.route('/angular-post-i-like-it')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Imagen.findById(req.body.liked)
    .then(a =>{
        if (!a) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({ mes:"The image you are trying to find doesn't exist"});
        } else if(req.body.id == null || req.body.id == undefined){
            res.json({ mes:"no hay datos"});
            return;
        } else {
            if (a.likes.indexOf(req.body.id) !== -1) {
                let resto = a.likes.indexOf(req.body.id)
                a.likes.splice(resto, 1)
                a.save()
                .then((u)=>{
                    Likes.findOne({ user: req.body.id})
                    .then( l => {
                        if (l.image.indexOf(req.body.liked) !== -1) {
                            var index = l.image.indexOf(req.body.liked);
                            l.image.splice(index, 1);
                            l.save()
                                .then((liker) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(liker);
                                    return;
                                })
                            } else if (l.image.indexOf(req.body.liked) == -1) {
                                l.image.push(req.body.liked)
                                l.save()
                                .then(liker => { 
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(liker);
                                    return;
                                })     
                            }
                    })
                })
            } else if (a.likes.indexOf(req.body.id) == -1){
                a.likes.push(req.body.id)
                a.save()
                .then((u)=>{
                    Likes.findOne({ user: req.body.id})
                    .then( l => {
                        if(!l){
                            Likes.create({ user: req.body.id })
                            .then((like) => {
                                like.image.push(req.body.liked);
                                like.save()
                                .then(likeUser =>{
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(likeUser);
                                })
                            }) 
                        } else {
                            if (l.image.indexOf(req.body.liked) !== -1) {
                                var index = l.image.indexOf(req.body.liked);
                                l.image.splice(index, 1);
                                l.save()
                                    .then((liker) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(liker);
                                        return;
                                    })
                            } else if (l.image.indexOf(req.body.liked) == -1) {
                                l.image.push(req.body.liked)
                                l.save()
                                .then(liker => { 
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(liker);
                                    return;
                                })     
                            }
                        }
                    })
                })
               
            }
        }
    })  
    .catch((err) => {
        return err;
    })
})
likeRouter.route('/angular-post-i-like-it-video')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Video.findById(req.body.liked)
    .then(a =>{
        if (!a) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({ mes:"The image you are trying to find doesn't exist"});
        } else if(req.body.id == null || req.body.id == undefined){
            res.json({ mes:"no hay datos"});
            return;
        } else {
            if (a.likes.indexOf(req.body.id) !== -1) {
                let resto = a.likes.indexOf(req.body.id)
                a.likes.splice(resto, 1)
                a.save()
                .then((u)=>{
                    Likes.findOne({ user: req.body.id})
                    .then( l => {
                        if (l.image.indexOf(req.body.liked) !== -1) {
                            var index = l.image.indexOf(req.body.liked);
                            l.image.splice(index, 1);
                            l.save()
                                .then((liker) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(liker);
                                    return;
                                })
                            } else if (l.image.indexOf(req.body.liked) == -1) {
                                l.image.push(req.body.liked)
                                l.save()
                                .then(liker => { 
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(liker);
                                    return;
                                })     
                            }
                    })
                })
            } else if (a.likes.indexOf(req.body.id) == -1){
                a.likes.push(req.body.id)
                a.save()
                .then((u)=>{
                    Likes.findOne({ user: req.body.id})
                    .then( l => {
                        if(!l){
                            Likes.create({ user: req.body.id })
                            .then((like) => {
                                like.image.push(req.body.liked);
                                like.save()
                                .then(likeUser =>{
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(likeUser);
                                })
                            }) 
                        } else {
                            if (l.image.indexOf(req.body.liked) !== -1) {
                                var index = l.image.indexOf(req.body.liked);
                                l.image.splice(index, 1);
                                l.save()
                                    .then((liker) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(liker);
                                        return;
                                    })
                            } else if (l.image.indexOf(req.body.liked) == -1) {
                                l.image.push(req.body.liked)
                                l.save()
                                .then(liker => { 
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(liker);
                                    return;
                                })     
                            }
                        }
                    })
                })
               
            }
        }
    })  
    .catch((err) => {
        return err;
    })
})
module.exports = likeRouter;