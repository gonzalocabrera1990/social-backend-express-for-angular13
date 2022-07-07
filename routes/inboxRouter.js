const express = require('express');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Inbox = require('../models/inbox');
const { addUser, removeUser, getUser, getUsers, getUserInRooms, usersRoom } = require('../usersSocketIoRooms');
const { saveUser, deleteUser, fetchUser, socketUserConnect } = require('../socketUsers');

const { randomNumber } = require('../helpers/libs');

const inboxRouter = express.Router();
inboxRouter.use(express.json());

// inboxRouter.route('/send/:talkId')
//     .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
//     .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
//         Inbox.findById(req.params.talkId)
//             .populate('members.userOne')
//             .populate('members.userTwo')
//             .then(inbox => {
//                 if (inbox !== null) {
//                     if (req.body) inbox.talk.push(req.body.talk)

//                     inbox.save()
//                         .then(inbox => {
//                             res.statusCode = 200;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json(inbox);
//                         })
//                         .catch(err => {
//                             res.statusCode = 500;
//                             res.setHeader("Content-Type", "application/json");
//                             res.json({ err: err });
//                         });

//                 } else {
//                     Inbox.create(req.body)
//                         .then((inbox) => {
//                             if (inbox !== null) {
//                                 inbox.room = randomNumber(10);
//                                 inbox.save()
//                                     .then(result => {
//                                         res.statusCode = 200;
//                                         res.setHeader('Content-Type', 'application/json');
//                                         res.json(result);
//                                     })
//                             }

//                         })
//                         .catch(err => {
//                             res.statusCode = 500;
//                             res.setHeader("Content-Type", "application/json");
//                             res.json({ err: err });
//                         });
//                 }
//             });
//     })
// //if the endpoint send/:talkId cannot load params, it will run /send/ and create a new inbox
// inboxRouter.route('/send')
//     .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
//     .post(cors.cors, authenticate.verifyUser, (req, res, next) => {
//         Inbox.create(req.body)
//             .then((inbox) => {
//                 if (inbox !== null) {
//                     inbox.room = randomNumber(10);
//                     inbox.save()
//                         .then(result => {
//                             res.statusCode = 200;
//                             res.setHeader('Content-Type', 'application/json');
//                             res.json(result);
//                         })
//                 }
//                 randomNumber(10);
//             })
//             .catch(err => {
//                 res.statusCode = 500;
//                 res.setHeader("Content-Type", "application/json");
//                 res.json({ err: err });
//             });
//     })

inboxRouter.route('/getch/:userId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Inbox.find({})
            .populate('members.userOne')
            .populate('members.userTwo')
            .then(inboxOne => {
                const results = inboxOne.filter(inbox => inbox.members.userOne._id == req.params.userId || inbox.members.userTwo._id == req.params.userId)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(results);
            })
            .catch(err => {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.json({ err: err });
            });
    })

// inboxRouter.route('/getch/talk/:talkId')
//     .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
//     .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
//         Inbox.findById(req.params.talkId)
//             .populate('members.userOne')
//             .populate('members.userTwo')
//             .then(talk => {
//                 res.statusCode = 200;
//                 res.setHeader('Content-Type', 'application/json');
//                 res.json(talk);
//             })
//             .catch(err => {
//                 res.statusCode = 500;
//                 res.setHeader("Content-Type", "application/json");
//                 res.json({ err: err });
//             });
//     })

module.exports = {
    routerInd: inboxRouter,
    start: function (io) {
        io.on('connection', function (socket) {
            //event: save user data in connected array

            socket.on('usernameAngular', (data) => {
                const usuario = saveUser({
                    id: data.id,
                    name: data.name,
                    socketId: socket.id
                })
                let clean = removeUser(data.id)
                socket.emit('returnUsernameAngular', usuario);
            });

            socket.on('clean-room', (id) => {
                let currentUser = getUser(id)
                if(currentUser){
                    socket.leave(currentUser.room)
                    let clean = removeUser(id)
                }
            });

            //event:search chat and get into that room
            socket.on('fetchChat', ({ query, usuario, room }) => {
                Inbox.findById(query)
                    .populate('members.userOne')
                    .populate('members.userTwo')
                    .then(inboxOne => {
                        if (inboxOne) {
                            //event: save user data in array room
                            let currentUser = getUser(usuario)
                            if(currentUser) socket.leave(currentUser.room)

                            const { user } = addUser({ id: usuario, name: query, room })
                            inboxOne.talk.map(item => {
                                if (item.author != usuario && !item.seen) {
                                    item.seen = true
                                }
                            })
                        }
                        inboxOne.save()
                            .then(result => {
                                socket.join(room)
                                socket.emit('sendChat', result);
                            })
                    })
            })

            //event: send message
            socket.on('sendMessage', ({ contenido, talkId, roomSocket }) => {
                let emisor = contenido.talk.author
                let receptor = emisor == contenido.members.userOne ? contenido.members.userTwo : contenido.members.userOne
                let socketReceptor = fetchUser(receptor);
                let roomReceptor = getUser(receptor);
                let roomEmisor = getUser(emisor);
                const { user } = addUser({ id: contenido.talk.author, name: contenido.talk.author, room: roomSocket })

                if (!socketReceptor) {
                    if (!talkId) {
                        Inbox.create(contenido)
                            .then((inbox) => {
                                Inbox.findById(inbox._id)
                                    .populate('members.userOne')
                                    .populate('members.userTwo')
                                    .then((item) => {
                                        if (item !== null) {
                                            item.room = randomNumber(10);
                                            item.save()
                                                .then(sol => {
                                                    socket.join(sol.room)
                                                    return sol
                                                })
                                                .then(rest => {
                                                    io.to(rest.room).emit('sendChat', rest);
                                                })
                                        }
                                    })
                            })
                    } else {
                        Inbox.findById(talkId)
                            .populate('members.userOne')
                            .populate('members.userTwo')
                            .then(inbox => {
                                if (inbox !== null) {
                                    inbox.talk.push(contenido.talk)
                                    inbox.save()
                                        .then(solve => {
                                            socket.join(solve.room)
                                            return solve
                                        })
                                        .then(rest => {
                                            io.to(rest.room).emit('sendChat', rest);
                                        })
                                }
                            })
                    }

                }
                //*************
                else if (socketReceptor && roomReceptor === undefined) {
                    if (!talkId) {
                        Inbox.create(contenido)
                            .then((inbox) => {
                                Inbox.findById(inbox._id)
                                    .populate('members.userOne')
                                    .populate('members.userTwo')
                                    .then((item) => {
                                        if (item !== null) {
                                            item.room = randomNumber(10);
                                            item.save()
                                                .then(sol => {
                                                    socket.join(sol.room)
                                                    return sol
                                                })
                                                .then(rest => {
                                                    io.to(rest.room).emit('sendChat', rest);
                                                    return rest
                                                })
                                                .then(api => {
                                                    console.log("aaaaaaaaa")
                                                    const sock = socketReceptor.socketId
                                                    socket.to(sock).emit("chatNotification", api);
                                                })
                                                .then(() => {
                                                    emisor = ""
                                                    receptor = ""
                                                    socketReceptor = ""
                                                    roomReceptor = ""
                                                    roomEmisor = ""
                                                })
                                        }
                                    })
                            })
                    } else {
                        Inbox.findById(talkId)
                            .populate('members.userOne')
                            .populate('members.userTwo')
                            .then(inbox => {
                                if (inbox !== null) {
                                    let sok = socketReceptor.socketId
                                    inbox.talk.push(contenido.talk)
                                    inbox.save()
                                        .then(sol => {
                                            socket.join(sol.room)
                                            return sol
                                        })
                                        .then(rest => {
                                            io.to(rest.room).emit('sendChat', rest);
                                            return rest
                                        })
                                        .then(api => {
                                            io.to(sok).emit('chatNotification', api);
                                        })
                                        .then(() => {
                                            emisor = ""
                                            receptor = ""
                                            socketReceptor = ""
                                            roomReceptor = ""
                                            roomEmisor = ""
                                        })
                                }
                            })
                    }
                }
                //*************

                else if (socketReceptor && roomReceptor) {
                    Inbox.findById(talkId)
                        .populate('members.userOne')
                        .populate('members.userTwo')
                        .then(inbox => {
                            if (inbox !== null) {
                                inbox.talk.push(contenido.talk)
                                inbox.talk.map(item => {
                                    if (item.author != emisor && !item.seen) {
                                        item.seen = true
                                    }
                                })
                                inbox.save()
                                    .then(sol => {
                                        socket.join(sol.room)
                                        return sol
                                    })
                                    .then(rest => {
                                        io.to(rest.room).emit('sendChat', rest);
                                    })
                            }
                        })
                }
                //*************

                randomNumber(10);
            })

            socket.on('removeuser', (id) => {
                let removido = removeUser(id)
            })
            socket.on('disconnect', function (data) {
                console.log('Got disconnect!', data);
            })
        })
    }
};