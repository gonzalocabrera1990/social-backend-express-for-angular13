const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Videos = new Schema({
  filename: {
    type: String,
    default: ''
  },
  userData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  timestamp: { type: Date, default: Date.now }
});

var Video = mongoose.model("videos", Videos);
module.exports = Video;