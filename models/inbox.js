const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    seen: {
        type: Boolean,
        default: false
    }
},
    {
        timestamp: { type: Date, default: Date.now }
    })

const Inbox = new Schema({
    members: {
        userOne: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        userTwo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    room: {
        type: String
    },
    talk: [Messages],
},
    {
        timestamp: { type: Date, default: Date.now }
    })

mongoose.model('Message', Messages);
module.exports = mongoose.model("Inbox", Inbox);