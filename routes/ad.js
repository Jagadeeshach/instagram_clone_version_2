const mongoose = require('mongoose');

const adSchema = mongoose.Schema({
    adImage: String,
    adtitle: String,
    addescription: String,
    businesslink: String,
    date: {
        type: Date,
        default: Date.now
    },
    adcreater: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'aduser',
    }],


});

module.exports = mongoose.model('ad', adSchema);