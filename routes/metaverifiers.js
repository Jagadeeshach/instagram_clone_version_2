const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');


const metaverifierSchema = mongoose.Schema({
    fullname: String,
    username: String,
    profileImage: String,
    email: String,
    phone: Number,
    job_role: String,
    employment_id: Number,
    password: String


});

metaverifierSchema.plugin(plm);

module.exports = mongoose.model('Metaverifier', metaverifierSchema);