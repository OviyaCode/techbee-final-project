const Submission = require('../models/submissionModel');
const Result = require('../models/resultModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')
const Question = require('../models/questionModel')


const setResult = asyncHandler(async (req, res) => {
  try {
    const submissionId = req.params.submissionId;
    const userId = req.body.userId;
    const score = req.body.score;
    const questionId = req.body.questionId;
    const overallResult = req.body.overallResult;
    console.log(submissionId)
    // Find the submission
    const submission = await Submission.findOne({ submissionId });

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found"
      });
    }

    // Find the user by user ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Find the question by question ID
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        message: "Question not found"
      });
    }

    // Create the result record
    const result = await Result.create({
      user: user._id,
      question: question._id,
      submission: submission._id,
      score,
      overallResult
    });

    res.status(201).json({
      message: "Result created",
      result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error occurred while creating result"
    });
  }
});

const getResult = async (req, res, next) => {
  try {
    const submission = await Submission.findOne({ submissionId: req.params.submissionId })
      .populate('user', 'username')
      .populate('question', 'title');

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found"
      });
    }

    const userId = submission.user._id;
    const questionId = submission.question._id;

    // Get total submission count for the user and the question
    const totalSubmissions = await Submission.countDocuments({ user: userId, question: questionId });

    let score = 0;
    let overallResult = '';

    if (submission.score === 'Pass') {
      score = 10;
      overallResult = 'Pass';
    }

    if (submission.score === 'Fail') {
      score = 0;
      overallResult = 'Fail';
    }

    res.status(200).json({
      message: "Result found",
      result: score,
      user: submission.user,
      overallResult,
      submission: {
        submissionId: submission.submissionId,
        code: submission.code,
        language: submission.language,
        timestamp: submission.timestamp
      },
      question: {
        questionId: submission.question._id,
        title: submission.question.title
      },
      submissionCount: totalSubmissions
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error occurred while fetching result"
    });
  }
};

const getResultsAll = asyncHandler(async (req, res) => {
  try {
    const results = await Result.find({})
      .populate({
        path: 'submission',
        populate: [
          { path: 'user', select: 'username' },
          { path: 'question', select: 'title' }
        ]
      });

    const count = results.length;

    res.status(200).json({
      count,
      results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error occurred while fetching results"
    });
  }
});

module.exports = {
  setResult,
  getResult,
  getResultsAll
};
