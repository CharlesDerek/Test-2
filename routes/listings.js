var express = require("express");
var router  = express.Router();
var listing = require("../models/listing");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require('geocoder');

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all listings
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all listings from DB
      listing.find({name: regex}, function(err, alllistings){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(alllistings);
         }
      });
  } else {
      // Get all listings from DB
      listing.find({}, function(err, alllistings){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(alllistings);
            } else {
              res.render("listings/index",{listings: alllistings, page: 'listings'});
            }
         }
      });
  }
});

//CREATE - add new listing to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to listings array
  var name = req.body.name;
  var image = req.body.image;
  var imagetwo = req.body.imagetwo;
  var imagethree = req.body.imagethree;
  var imagefour = req.body.imagefour;
  var imagefive = req.body.imagefive;
  var desc = req.body.description;
  var strictness = req.body.strictness;
  var author = {
      id: req.user._id,
      username: req.user.username,
      avatar: req.user.avatar
  }
  var cost = req.body.cost;
  
  
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newlisting = {name: name, image: image, imagetwo: imagetwo, imagethree: imagethree, imagefour: imagefour, imagefive: imagefive, description: desc, strictness: strictness, cost: cost, author:author, location: location, lat: lat, lng: lng};
    // Create a new listing and save to DB
    listing.create(newlisting, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to listings page
            console.log(newlyCreated);
            res.redirect("/listings");
        }
    });
  });
  
});

//NEW - show form to create new listing
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("listings/new"); 
});

// SHOW - shows more info about one listing
router.get("/:id", function(req, res){
    //find the listing with provided ID
    listing.findById(req.params.id).populate("comments").exec(function(err, foundlisting){
        if(err){
          console.log(err);
        } else {
          console.log(foundlisting)
          //render show template with that listing
          res.render("listings/show", {listing: foundlisting});
        }
    });
});

//EDIT - ROUTE
router.get("/:id/edit", middleware.checkuserlisting, function(req, res){
    //find the listing with provided ID
    listing.findById(req.params.id, function(err, foundlisting){
        if(err){
            console.log(err);
        } else {
            //render show template with that listing
            res.render("listings/edit", {listing: foundlisting});
        }
    });
});

router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, imagetwo: req.body.imagetwo, imagethree: req.body.imagethree, imagefour: req.body.imagefour, imagefive: req.body.imagefive, description: req.body.description, strictness: req.body.strictness, cost: req.body.cost, location: location, lat: lat, lng: lng};
    listing.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, listing){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/listings/" + listing._id);
        }
    });
  });
});

router.delete("/:id", function(req, res) {
  listing.findByIdAndRemove(req.params.id, function(err, listing) {
    Comment.remove({
      _id: {
        $in: listing.comments
      }
    }, function(err, comments) {
      req.flash('error', listing.name + ' deleted!');
      res.redirect('/listings');
    })
  });
});

module.exports = router;
