const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');


const metaleaduserSchema = mongoose.Schema({
    profile_pic: String,
    username: String,
    fullname: String,
    phone: String,
    email: String,
    job_position : String,
    employment_id: Number,
    password: String

})

metaleaduserSchema.plugin(plm);

module.exports = mongoose.model('Metaleaduser', metaleaduserSchema);
