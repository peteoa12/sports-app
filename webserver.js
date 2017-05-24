
//Requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser')

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use( bodyParser.json() ); //For parsing JSON data.
app.use( bodyParser.urlencoded({extended:true}) ); //For parsing data from forms.


var mongoose = require('mongoose');


//Serve up the front end
app.use(express.static('public'));


//============================================Passport-Google-Oauth=======================================//

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
  done(null, user);
  // console.log("user", user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
  // console.log("obj", obj);
});

passport.use(new GoogleStrategy({
    clientID: '276644379868-qdcobihc12g9irv94od3karbcm1et8dk.apps.googleusercontent.com',
    clientSecret: 'iuWvwjx8y8YrZvP0LU9LWDf9',
    callbackURL: "http://dev.peternormandev.com/auth/google/callback/"
  },
  function(accessToken, refreshToken, profile, done) {
    //check user table for anyone with a google ID of profile.id
    console.log("logged in", profile);
    User.findOne({
        'googleID': profile.id 
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        //No user was found... so create a new user with values from google (all the profile. stuff)
        if (!user) {

            console.log("no user found, making one based on profile data ", profile)
            user = new User({
                googleID: profile.id
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            //found user. Return
            console.log("existing user found")
            return done(err, user);
        }
    });
}
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

//==================================================Mongoose serving MongoDB====================================//

var db = mongoose.connection;
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/local');

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log("we are super duper connected");
}); 

var userSchema = new Schema({
    googleID: String,
    googleImg: String,
    googleName: String

});
var User = mongoose.model('User', userSchema);


var gameSchema = new Schema({
  gameID: String,
  gameCat:String,
  gameLocation: String,
  gameDate: String,
  gameTime: String,
  messages:String,
  creatorID: String, // relates to Users
});
var Game = mongoose.model('Game', gameSchema);



//================================================Express Routes=========================================//

//read   //GET /messages      get all messages
//create //POST /messages       make a new message
//read   //GET /messages/1        get message 1
//update //POST /messages/:id     update message with matching id
//delete //DELETE /messages/:id     delete message with matching id

//------------------------------------------------Set Headers-------------------------------------------//

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

//----------------------------------Route for creating, updating and delting new game posts----------------------//

//create/POST a new game to /games
app.post('/games', function (req, res) {

  let newGame = new Game();
  newGame.gameCat = req.body.category;
  newGame.gameLocation = req.body.location;
  newGame.gameTime = req.body.time;
  newGame.save(function(err, game) {
    if (err) {
      console.warn(err);
    } else {
      console.log(game);
    }
  })
  console.log(newGame); 
  res.send(newGame);
})

//update/POST a change to a created game in games/:id
app.post('/messages/:id', function(req, res) {
  console.log('you updated a game.')
});

//delete/DELETE a posted game from /games/:id
app.delete('/games/:id', function (req, res) {
  console.log("you deleted a game");
})


//----------------------------------Route for reading all games, reading one specific games-------------------//

//read/GET all games from /games
app.get('/games', function (req, res) {
  console.log("you are viewing all games")
})


//read/GET one game in /games/:id
app.get('/games/:id', function (req, res) {
  console.log("you are viewing one game")
})

//create/POST a response to a game POST in /games/:id
app.post('/games/:id', function (req, res) {
  console.log("you are replying to a game")
})

//Express Listener
app.listen(80, function () {
  console.log('Sports-App listening on port 80!')
})


// save it in mongoose/mongo database







 
