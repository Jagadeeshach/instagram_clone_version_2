const mongoose = require('mongoose'); //Step 2 : Connect to database and create new one "instaclone"
const plm = require('passport-local-mongoose'); //Step 3: import plm and send the user data to passport for su and dsu.

mongoose.connect('mongodb://127.0.0.1:27017/instaclone');

const userSchema = mongoose.Schema({ // Step 2 : Create required data from user
    username: String,
    name: String,
    email: String,
    password: String,
    profileImage: String,
    bio: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],


});

userSchema.plugin(plm); // Step 3 : Because of this serializeuser and deserialize user performs or we connect to su and dsu.

module.exports = mongoose.model('user', userSchema); // Exporting user model.