const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Story = new Schema({
  filename: {
    type: String,
    default: ''
  },
  userData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  duration: {
    type: Number,
    default: ''
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  timestamp: { type: Date, default: Date.now }
});

var Stories = mongoose.model("story", Story);
module.exports = Stories;