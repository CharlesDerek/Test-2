var express = require("express");
var router  = express.Router();
var passport = require("passport");
var user = require("../models/user");
var listing = require("../models/listing");
var middleware = require("../middleware");
var geocoder = require('geocoder');

//root route
router.get("/", function(req, res){
    res.render("landing");
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//handle sign up logic
router.post("/register", function(req, res){
    
    var newuser = new user({
        username: req.body.username,
        avatar: req.body.avatar,
        avatartwo: req.body.avatartwo,
        avatarthree: req.body.avatarthree,
        avatarfour: req.body.avatarfour,
        avatarfive: req.body.avatarfive,
        bio: req.body.bio,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        location: req.body.location
      });

    if(req.body.adminCode === 'secretcode123') {
      newuser.isAdmin = true;
    }

    user.register(newuser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up To ExotiVentures from MRGI USA! Nice to meet you " + req.body.username);
           res.redirect("/listings"); 
        });
    });
});


//user EDIT - ROUTE
router.get("users/:id", middleware.checkuserownership, function(req, res){
    //find the listing with provided ID
    user.findById(req.params.id, function(err, founduser){
        if(err){
            console.log(err);
        } else {
            //render show template with that listing
            res.render("users/:id", {user: founduser});
        }
    });
});

router.put("users/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newuserData = {
        username: req.body.username,
        avatar: req.body.avatar,
        avatartwo: req.body.avatartwo,
        avatarthree: req.body.avatarthree,
        avatarfour: req.body.avatarfour,
        avatarfive: req.body.avatarfive,
        bio: req.body.bio,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        location: location,
        lat: lat,
        lng: lng
        
    };
    user.findByIdAndUpdate(req.params.id, {$set: newuserData}, function(err, user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/listings");
        }
    });
  });
});


//show login form
router.get("/login", function(req, res){
  res.render("login", {page: 'login'});
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/listings",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome " +  user.username + "!"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later " + user.username + "!");
   res.redirect("/listings");
});

// USER PROFILE
router.get("/users/:id", function(req, res) {
  user.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/");
    }
    listing.find().where('author.id').equals(foundUser._id).exec(function(err, listings) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }
      res.render("users/show", {user: foundUser, listings: listings});
    })
  });
});


//Connect Route

router.get("/connect", function(req, res){
   res.render("connect", {page: 'connect'}); 
});


//handling Connect logic
router.post("/connect/submit", passport.authenticate("local", 
    {
        successRedirect: "/connect",
        failureRedirect: "/connect",
        failureFlash: true,
        successFlash: 'Your Inquiry has been received, thank you! We will follow up with a response as soon as possible!'
    }), function(req, res){
});


//application Route

router.get("/applications", function(req, res){
   res.render("applications", {page: 'applications'}); 
});


//Connect Route

router.get("/connect", function(req, res){
   res.render("connect", {page: 'connect'}); 
});



module.exports = router;


