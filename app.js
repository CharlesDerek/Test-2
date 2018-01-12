var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    // cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    listing  = require("./models/listing"),
    Comment     = require("./models/comment"),
    user        = require("./models/user"),
    session = require("express-session"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override");
// // configure dotenv
// require('dotenv').load();

//requiring routes
var commentRoutes    = require("./routes/comments"),
    listingRoutes = require("./routes/listings"),
    indexRoutes      = require("./routes/index");

 
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v10";
mongoose.connect(url, {useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
// app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentuser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/comments", commentRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Exotiventures Server Has Started!");
});