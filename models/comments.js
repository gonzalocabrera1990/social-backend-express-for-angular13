const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Comment = new Schema({
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', Comment);