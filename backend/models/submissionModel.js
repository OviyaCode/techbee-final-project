const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require: true
    },
    question:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Question',
        required: true
    },
    submissionId:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        enum:[71,62],
        required:true
    },
    score:{
        type:String,
        enum:['Pass','Fail']
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Submission', submissionSchema);
