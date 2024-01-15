var express = require('express');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./post'); //Step 21: importing post model
const aduserModel = require('./adusers')
const adModel = require('./ad');
const metaVerifierModel = require('./metaverifiers');
const metaleaduserModel = require('./metaleadusers');
const passport = require('passport'); //Step 5
const localStrategy = require('passport-local'); //Step 5 : Import local strategy
const upload = require('./multer');

passport.use(new localStrategy(userModel.authenticate())); //Step 5: Functionality to login to account using username and password.

router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/login', function(req, res, next) {


  res.render('login', {footer: false, error: req.flash('error')});
});

router.get('/feed', isLoggedIn, async function(req, res) { //Step 23: Bringing uploaded posts in feed page
  const user = await userModel.findOne({username: req.session.passport.user}); //Step 38: Taking loggedin user
  const posts = await postModel.find().populate("user");
  const allusers = await userModel.find()

  res.render('feed', {footer: true, posts, user, allusers}); //Step 24: sending props to feed page, Step 38: Sending user to feed page
});

router.get('/profile', isLoggedIn, async function(req, res) { //Step 19: taking user data and sending props to profile page.
  const user = await userModel.findOne({username: req.session.passport.user}).populate('posts'); 
  //Step 27: populating uploaded posts in user profile by sending props
  res.render('profile', {footer: true, user});
});

//Ads Manager starting
router.get('/adregister', function(req, res,){
  res.render('adregister');
});

router.get('/adlogin', function(req, res){
  res.render('adlogin');
});

router.get('/createad', isaduserloggedIn, function(req, res){
  res.render('createad');
});

router.get('/profiledp', isaduserloggedIn, async function(req, res){
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('profiledp', {user});
});

router.get('/proimages', isaduserloggedIn, async function(req, res){
  const user = await userModel.findOne({username: req.session.passport.user}).populate('posts');
  res.render('proimages', {user});
});

router.get('/footer', isLoggedIn, async function(req, res){
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('footer', {user});
});

//Ads Manager ending

//Meta Verification starting
router.get('/metahelpreg', function(req, res){
  res.render('metahelpreg');
});

router.get('/metahelplog', function(req, res){
  res.render('metahelplog');
});

router.get('/metahelp', isverifierloggedIn, function(req, res){
  res.render('metahelp');
});


//Meta Verification ending

//Meta Lead User Starting
router.get('/metaleadreg', function(req, res){
  res.render('metaleadreg');
});

router.get('/metaleadlog', function(req, res){
  res.render('metaleadlog');
});

router.get('/metalead', isleadloggedIn, function(req, res){
  res.render('metalead');
});


//Meta Lead User Ending

router.get('/search', isLoggedIn, async function(req, res) {
  const posts = await postModel.find().populate("user");
  res.render('search', {footer: true, posts});
});

router.get('/like/posts/:id', isLoggedIn, async function(req, res) { //Step 37: Creating route for like button
  const user = await userModel.findOne({username: req.session.passport.user}); //Finding the loggedin user
  const post = await postModel.findOne({_id: req.params.id}); //Finding the post on the basis of id

  if (post.likes.indexOf(user._id) === -1 ){ //Add like if it is not there
    post.likes.push(user._id);
  }else{
    post.likes.splice(post.likes.indexOf(user._id), 1); //Remove like if it is there
  }

  await post.save();
  res.redirect('/feed');
});



router.get('/edit', isLoggedIn, async function(req, res) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('edit', {footer: true, user }); //Step 17: taking user data and sending props to edit page
});

router.get('/upload', isLoggedIn, function(req, res) {
  res.render('upload', {footer: true});
});

router.get('/username/:username', isLoggedIn, async function(req, res) { //Step  31: taking the axios request from frontend and search
  const regex = new RegExp(`${req.params.username}`, 'i'); 
        //Using regex to finding users, here ': username' and '.username' means input we are getting from frontend 
  const users = await userModel.find({username: regex}); //lets find all users in search
  res.json(users); //Step 32: sending results in json
});


router.post('/register', function(req, res, next){
  const userData = new userModel({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
  });

  // Step 4 : To connecting real data registering with setuped tools and create account but have not login.
  userModel.register(userData, req.body.password) //Step 4
  .then(function(){
    passport.authenticate('local') (req, res, function(){ //Step 5: When login users redirected to their profile page.
      res.redirect('/feed');
    }); 
  });
});

router.post('/login', passport.authenticate('local', { //Step 6 : Creating login process through username and password
  successRedirect: '/feed',
  failureRedirect: '/login',
  failureFlash: true
  
  
}), function(req, res) {

  res.render('/login', {footer: true});
});

router.get('/logout', function(req, res, next){  //Step 7 : Creating logout process
  req.logout(function(err){
    if(err) { return next(err); }
    res.redirect('/login');
  });

});


router.post("/update", upload.single('image'), async function(req, res){
   //Step 11: set up of multer. Create a new folder in image "uploads"
   //Step 13:  importing and adding upload functionality tp route with it's input field

   const user = await userModel.findOneAndUpdate( 
     { username: req.session.passport.user }, 
     { username: req.body.username,
       name: req.body.name,
       bio: req.body.bio }, //Step 14: finding the user and update .findOneAndUpdate(unique, data, {new: true}); 
     { new: true }
     );
     if(req.file){
      user.profileImage = req.file.filename; //Step 15: Updating user profile if there is file selected
      
     }
     
    await user.save(); //Save manually
    res.redirect('/profile'); //Step 16: Redirecting to profile page after updating

});

router.post("/upload", isLoggedIn, upload.single('image'), async function(req, res){
  const user = await userModel.findOne({username: req.session.passport.user}); 
  //Step: 22: Creating uploading functionality, sharing user's id to post and post's id to user in array
  const post = await postModel.create({
    picture: req.file.filename,
    user: user._id,
    caption: req.body.caption,

  })

  user.posts.push(post._id);
  await user.save();
  res.redirect("/feed");


});


//-----------------------------------------------------------------------------------------------------------------------------
// Ads Manager starting
router.post('/adregister', function(req, res, next){
  const aduserData = new aduserModel({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone,
    businessname: req.body.businessname,
    office_location: req.body.office_location,
    office_address: req.body.office_address, 
    businesscategory: req.body.businesscategory,
    number_of_employees: req.body.number_of_employees

  });
  
  aduserModel.register(aduserData, req.body.password) 
  .then(function(){
    passport.authenticate('local') (req, res, function(){ 
      res.redirect('/createad');
    }); 
  });
});

router.post('/adlogin', passport.authenticate('local', { 
  successRedirect: '/createad',
  failureRedirect: '/adlogin',
  failureFlash: true
  
  
}), function(req, res) {

  res.render('/adlogin');
});

router.get('/lgout', function(req, res, next){  
  req.logout(function(err){
    if(err) { return next(err); }
    res.redirect('/adlogin');
  });

});

function isLoggedIn(req, res, next){   
  if(req.isAuthenticated()) return next(); //Step 8 : To create protected routes
  res.redirect('/login');
}

function isaduserloggedIn(req, res, next){   
  if(req.isAuthenticated()) return next(); 
  res.redirect('/adlogin');
}


// Ads Manager ending
// ----------------------------------------------------------------------------------------------------------------------


// -----------------------------------------------------------------------------------------------------------------------
//Meta Verification Starting
router.post('/metahelpreg', function(req, res, next){
  const verifierData = new metaVerifierModel({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
    phone: req.body.phone,
    job_role: req.body.job_role,
    employment_id: req.body.employment_id

  });
  
  metaVerifierModel.register(verifierData, req.body.password) 
  .then(function(){
    passport.authenticate('local') (req, res, function(){ 
      res.redirect('/metahelp');
    }); 
  });
});

router.post('/metahelplg', passport.authenticate('local', { 
  successRedirect: '/metahelp',
  failureRedirect: '/metahelplog',
  failureFlash: true
  
  
}), function(req, res) {

  res.render('/metahelplog');
});

router.get('/lggout', function(req, res, next){  
  req.logout(function(err){
    if(err) { return next(err); }
    res.redirect('/metahelplog');
  });

});



function isverifierloggedIn(req, res, next){   
  if(req.isAuthenticated()) return next(); 
  res.redirect('/metahelplog');
}



//Meta Verification Ending
//------------------------------------------------------------------------------------------------------------------------

//Meta Lead User Starting
router.post('/metaleadreg', function(req, res, next){
  const leadData = new metaleaduserModel({
    username: req.body.username,
    fullname: req.body.fullname,
    phone: req.body.phone,
    email: req.body.email,
    job_position : req.body.job_position,
    employment_id: req.body.employment_id
  

  });
  
  metaleaduserModel.register(leadData, req.body.password) 
  .then(function(){
    passport.authenticate('local') (req, res, function(){ 
      res.redirect('/metalead');
    }); 
  });
});

router.post('/metaleadlog', passport.authenticate('local', { 
  successRedirect: '/metalead',
  failureRedirect: '/metaleadlog',
  failureFlash: true
  
  
}), function(req, res) {

  res.render('/metaleadlog');
});

router.get('/lrgout', function(req, res, next){  
  req.logout(function(err){
    if(err) { return next(err); }
    res.redirect('/metaleadlog');
  });

});



function isleadloggedIn(req, res, next){   
  if(req.isAuthenticated()) return next(); 
  res.redirect('/metaleadlog');
}

//Meta Lead User Ending





module.exports = router;
