const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const aduserSchema = mongoose.Schema({
    username: String,
    fullname: String,
    email: String,
    password: String,
    phone: Number,
    businessname: String,
    office_location: String,
    office_address: String,
    businesscategory: String,
    number_of_employees: Number,
    ads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ad'
    }]

});

aduserSchema.plugin(plm);

module.exports = mongoose.model('aduser', aduserSchema);