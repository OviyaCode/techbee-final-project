const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please enter your name']
    },
    email:{
        type:String,
        required:[true, 'Please enter valid email'],
        unique:true
    },
    password:{
        type:String,
        required:[true, 'Please enter password']
    },
    role:{
        type:String,
        enum: ['admin', 'editor', 'student'],
        default: 'student'
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('User', userSchema);

