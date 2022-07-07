const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var likeSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'imagenes'
    }]
}, {
    timestamps: true
});
var Like = mongoose.model('Like', likeSchema);
module.exports = Like;