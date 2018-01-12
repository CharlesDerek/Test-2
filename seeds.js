var mongoose = require("mongoose");
var listing = require("./models/listing");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Cloud's Rest", 
        image: "http://i877.photobucket.com/albums/ab334/RENNtech/IMG_4285.jpg",
        description: "Persistence: The Sustained Effort Necessary to Induce Faith The addition of willpower to desire is the basis of persistence, which must be applied to the other mentioned principles. Persistence is a state of mind that can be cultivated by having definiteness of purpose, desire, self-reliance, definiteness of plans, accurate knowledge, cooperation, willpower, and habit."
    },
    {
        name: "Desert Mesa", 
        image: "http://www.barrett-jackson.com/staging/carlist/items/Fullsize/Cars/154105/154105_Front_3-4_Web.jpg",
        description: "Persistence: The Sustained Effort Necessary to Induce Faith The addition of willpower to desire is the basis of persistence, which must be applied to the other mentioned principles. Persistence is a state of mind that can be cultivated by having definiteness of purpose, desire, self-reliance, definiteness of plans, accurate knowledge, cooperation, willpower, and habit."
    },
    {
        name: "Canyon Floor", 
        image: "https://s-media-cache-ak0.pinimg.com/originals/1c/dc/4f/1cdc4fc6c04c23a0c1c72284abff85f9.jpg",
        description: "Persistence: The Sustained Effort Necessary to Induce Faith The addition of willpower to desire is the basis of persistence, which must be applied to the other mentioned principles. Persistence is a state of mind that can be cultivated by having definiteness of purpose, desire, self-reliance, definiteness of plans, accurate knowledge, cooperation, willpower, and habit."
    },
    {
        name: "The Lifer Wagon", 
        image: "https://s-media-cache-ak0.pinimg.com/originals/16/0b/b2/160bb2ba16343a3c5046cd1bc93c7898.jpg",
        description: "Persistence: The Sustained Effort Necessary to Induce Faith The addition of willpower to desire is the basis of persistence, which must be applied to the other  Persistence is a state of mind that can be cultivated by having definiteness of purpose, desire, self-reliance, definiteness of plans, accurate knowledge, cooperation, willpower, and habit."
    }
]

function seedDB(){
   //Remove all listings
   listing.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed listings!");
         //add a few listings
        data.forEach(function(seed){
            listing.create(seed, function(err, listing){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a listing");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                listing.comments.push(comment);
                                listing.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
