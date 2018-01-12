var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
   username: String,
   password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: String,
    avatartwo: String,
    avatarthree: String,
    avatarfour: String,
    avatarfive: String,
	bio: String,
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: {type: Boolean, default: false},
   location: String,
   lat: Number,
   lng: Number,
   createdAt: { type: Date, default: Date.now },
   listing:  [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "listing"
      }
   ],
   about: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "About"
      }
   ]
});

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("user", userSchema);