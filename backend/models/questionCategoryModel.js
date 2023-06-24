const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionCategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter question category name'],
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'questions',
        }
    ],
    type: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard']
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});
QuestionCategorySchema.index({name:1, type:1, difficulty:1},{unique:true})
module.exports = mongoose.model('questionCategory', QuestionCategorySchema);
