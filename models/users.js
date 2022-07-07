const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
const path = require("path");


const Image = new Schema({
  filename: {
    type: String,
    default: 'images/perfildefault.jpg'
  }
},
  {
    timestamp: { type: Date, default: Date.now }
  });

const ImageStart = new Schema({
  imageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'imagenes'
    },
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'videos'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    field: 'image'
  }],
  timestamp: { type: Date, default: Date.now }
});
mongoose.model("ImageStart", ImageStart);
const Followers = new Schema({
  id: {
    type: String
  },
  timestamp: { type: Date, default: Date.now }
});

const Following = new Schema({
  id: {
    type: String
  },
  timestamp: { type: Date, default: Date.now }
});

const Notification = new Schema({
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }, // Notification creator
  message: {
    type: String
  }, // any description of the notification message 
  readstatus: {
    type: Boolean,
    default: false
  },
  timestamp: { type: Date, default: Date.now }

})

const User = new Schema(
  {
    country: {
      type: String,
      default: ""
    },
    date: {
      type: String,
      default: ""
    },
    sex: {
      type: String,
      default: ""
    },
    admin: {
      type: Boolean,
      default: false
    },
    firstname: {
      type: String,
      default: ""
    },
    lastname: {
      type: String,
      default: ""
    },
    usuario: {
      type: String,
      default: ""
    },
    phrase: {
      type: String,
      default: ""
    },
    publicStatus: {
      type: Boolean,
      default: true
    },
    image: Image,
    followers: [Followers],
    following: [Following],
    imagesWall: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'imagenes'
    }],
    videosWall: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'videos'
    }],
    stories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'story'
    }],
    notifications: [Notification],
    start: [ImageStart]
  },
  {
    timestamp: { type: Date, default: Date.now }
  }
);
User.plugin(passportLocalMongoose);
ImageStart.virtual('commento', {
  ref: 'Comment',
  localField: 'comments[0]',
  foreignField: 'image'
})
ImageStart.set('toObject', { virtuals: true })
ImageStart.set('toJSON', { virtuals: true })
module.exports = mongoose.model("User", User);
