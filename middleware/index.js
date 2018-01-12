var Comment = require("../models/comment");
var listing = require("../models/listing");
var user = require("../models/user");


module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/login");
    },
    checkuserlisting: function(req, res, next){
        if(req.isAuthenticated()){
            listing.findById(req.params.id, function(err, listing){
               if(listing.author.id.equals(req.user._id) || req.user.isAdmin){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   console.log("BADD!!!");
                   res.redirect("/listings/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/login");
        }
    },
    checkuserownership: function(req, res, next){
        if(req.isAuthenticated()){
            user.findById(req.params.id, function(err, user){
               if(user.id.equals(req.user._id) || req.user.isAdmin){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   console.log("BADD!!!");
                   res.redirect("/listings");
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/login");
        }
    },
    checkuserComment: function(req, res, next){
        console.log("YOU MADE IT!");
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
               if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("/listings/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("login");
        }
    }
}