const express = require('express');
const authenticate = require('../authenticate');
const Comment = require('../models/comments');
const commentRouter = express.Router();
commentRouter.use(express.json());

const cors = require('./cors');

commentRouter.route('/post-comment')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.body != null) {
            req.body.author = req.user._id;
            Comment.create(req.body)
                .then((comment) => {
                    Comment.findById(comment._id)
                        .populate('author')
                        .then((comment) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(comment);
                        })
                }, (err) => next(err))
                .catch((err) => next(err));
        }
        else {
            err = new Error('Comment not found in request body');
            err.status = 404;
            return next(err);
        }

    });
    commentRouter.route('/angular-post-comment')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.body != null) {
            req.body.author = req.user._id;
            Comment.create(req.body)
                .then((comment) => {
                    Comment.find({image: comment.image})
                        .populate('author')
                        .then((com) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(com);
                        })
                }, (err) => next(err))
                .catch((err) => next(err));
        }
        else {
            err = new Error('Comment not found in request body');
            err.status = 404;
            return next(err);
        }
    });

commentRouter.route('/get-comments-image/:imageId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Comment.find({ image: req.params.imageId })
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Comment.findById(req.params.imageId)
            .then((comment) => {
                if (comment != null) {
                    if (!comment.author.equals(req.user._id)) {
                        var err = new Error('You are not authorized to update this comment!');
                        err.status = 403;
                        return next(err);
                    }
                    req.body.author = req.user._id;
                    Comment.findByIdAndUpdate(req.params.imageId, {
                        $set: req.body
                    }, { new: true })
                        .then((comment) => {
                            Comment.findById(comment._id)
                                .populate('author')
                                .then((comment) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(comment);
                                })
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Comment ' + req.params.imageId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Comment.findById(req.params.imageId)
            .then((comment) => {
                if (comment != null) {
                    if (!comment.author.equals(req.user._id)) {
                        var err = new Error('You are not authorized to delete this comment!');
                        err.status = 403;
                        return next(err);
                    }
                    Comment.findByIdAndRemove(req.params.imageId)
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    err = new Error('Comment ' + req.params.imageId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

    commentRouter.route('/delete-comment-image/:imageId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Comment.findById(req.params.imageId)
            .then((comment) => {
                if (comment != null) {
                    if (!comment.author.equals(req.user._id)) {
                        var err = new Error('You are not authorized to delete this comment!');
                        err.status = 403;
                        return next(err);
                    }
                    Comment.findByIdAndRemove(req.params.imageId)
                        .then((resp) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    err = new Error('Comment ' + req.params.imageId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = commentRouter;