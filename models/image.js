const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Imagenes = new Schema({
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

var Imagen = mongoose.model("imagenes", Imagenes);
module.exports = Imagen;