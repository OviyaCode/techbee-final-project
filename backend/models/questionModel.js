const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'questionCategories'
    },
    title: {
        type: String,
        required: [true, 'Please enter the question']
    },
    description: {
        type: String,
        required: [true, 'Please enter the question description']
    },
    testCases: [
        {
            input: {
                type: Schema.Types.Mixed,
                required: [true, 'Please enter the testcase input']
            },
            output: {
                type: Schema.Types.Mixed,
                required: [true, 'Please enter the testcase output']
            },
        }
    ],
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question',QuestionSchema);