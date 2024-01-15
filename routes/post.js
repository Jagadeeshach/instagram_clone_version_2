const mongoose = require('mongoose');  //Step 20: Creating post file and postmodel


const postSchema = mongoose.Schema({
    picture: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    caption: String,

    date: {
        type: Date,
        default: Date.now,

    },
    
    likes : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]
   


});


module.exports = mongoose.model('post', postSchema); // Exporting post model.