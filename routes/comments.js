var express = require("express");
var router  = express.Router({mergeParams: true});
var listing = require("../models/listing");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find listing by id
    console.log(req.params.id);
    listing.findById(req.params.id, function(err, listing){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {listing: listing});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup listing using ID
   listing.findById(req.params.id, function(err, listing){
       if(err){
           console.log(err);
           res.redirect("/listings");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               listing.comments.push(comment);
               listing.save();
               console.log(comment);
               req.flash('success', 'Created a comment!');
               res.redirect('/listings/' + listing._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    // find listing by id
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {listing_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/listings/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkuserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
            listing.findByIdAndUpdate(req.params.id, {
              $pull: {
                comments: comment.id
              }
            }, function(err) {
              if(err){ 
                console.log(err)
              } else {
                req.flash('error', 'Comment deleted!');
                res.redirect("/listings/" + req.params.id);
              }
            });
        }
    });
});

module.exports = router;