var mongoose = require("mongoose");

var listingSchema = new mongoose.Schema({
   name: String,
   image: String,
   imagetwo: String,
   imagethree: String,
   imagefour: String,
   imagefive: String,
   description: String,
   cost: Number,
   location: String,
   strictness: String,
   lat: Number,
   lng: Number,
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "user"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("listing", listingSchema);