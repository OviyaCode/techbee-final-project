const Submission = require('../models/submissionModel');
const Question = require('../models/questionModel');
const User = require('../models/userModel');
const axios = require('axios');
const asyncHandler = require('express-async-handler');
const { default: mongoose } = require('mongoose');

const submitCode = asyncHandler(async (req, res) => {

  try {
    const { submissionId, userId, code, questionId, languageId, score } = req.body;
    if (!req.body.submissionId || !req.body.userId || !req.body.submissionId || !req.body.questionId || !req.body.languageId || !req.body.score || !req.body.code) {
      res.status(404)
      throw new Error("You can't made this submission, required fields are missing")
    }

    const previousSubmissionsCount = await Submission.countDocuments({ user: userId, question: questionId });
    if (previousSubmissionsCount >= 3) {
      return res.status(201).json({ message: 'You have reached the maximum limit of submissions for this question' })
    }


    const submissionCode = await Submission.create({
      user: userId,
      question: questionId,
      submissionId: submissionId,
      code: req.body.code,
      language: req.body.languageId,
      score: req.body.score,
      status: "solved"
    })
    res.status(200).json({
      submissionData: submissionCode
    })
  } catch (error) {
    res.status(400)
    throw new Error("Internal server error")
    console.error(error);
  }
});


const runCode = async (req, res) => {
  try {
    const { questionId, code, languageId, testCases, userId } = req.body;

    const questionDetails = await Question.findById(questionId);
    if (!questionDetails) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const results = [];
    let submissionToken = '';
    let hasCompilationError = false;

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];

      let inputs;
      let expectedOutput;

      if (Array.isArray(testCase.input)) {
        inputs = testCase.input;
      } else {
        inputs = [testCase.input];
      }

      if (Array.isArray(testCase.output)) {
        expectedOutput = testCase.output;
      } else {
        expectedOutput = [testCase.output];
      }

      const response = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions',
        {
          source_code: code,
          language_id: languageId,
          stdin: JSON.stringify(inputs),
          expected_output: JSON.stringify(expectedOutput),
          expected_output_files: [],
          callback_url: '',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
        }
      );

      let submissionOutputs = [];
      let testResult = null;
      hasCompilationError = false;

      while (true) {
        const submissionStatusResponse = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${response.data.token}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            },
          }
        );

        if (submissionStatusResponse.data.status.id <= 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          const stdout = submissionStatusResponse.data.stdout;
          const statusId = submissionStatusResponse.data.status.id;
          const statusDescription = submissionStatusResponse.data.status.description;
          if (statusId === 6) {
            hasCompilationError = true;
            testResult = {
              userId: userId,
              input: testCase.input,
              expectedOutput: testCase.output,
              submissionOutput: null,
              finalAnswer: 'Fail',
              statusId: statusId,
              statusDescription: statusDescription,
            };
            break;
          } else {
            if (stdout) {
              if (stdout.includes('\n')) {
                submissionOutputs = stdout.split('\n');
              } else {
                submissionOutputs.push(stdout);
              }
            }
          }
          break;
        }
      }
      submissionToken = response.data.token;

      if (!hasCompilationError) {
        const submissionOutput = submissionOutputs[0];
        const output = expectedOutput[0] === submissionOutput ? 'Pass' : 'Fail';
        testResult = {
          userId: userId,
          input: testCase.input,
          expectedOutput: testCase.output,
          submissionOutput: submissionOutput,
          finalAnswer: output,
        };
      }

      results.push(testResult);
    }
    if (hasCompilationError) {
      return res.status(500).json({ message: 'Compilation Error, Please check your code' });
    }

    return res.status(200).json({ message: 'Code executed successfully', results, submissionToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



const getAllSubmissions = asyncHandler(async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('question', 'title')
      .populate('user', 'username')
      .select('_id user question code language score timestamp')
      .lean();

    const count = submissions.length;

    res.status(200).json({ count, submissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const getUserSubmissions = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;

    const submissions = await Submission.find({ user: userId })
      .populate('question', 'title')
      .select('_id user question code language score timestamp')
      .lean();

    const count = submissions.length;

    res.status(200).json({ count, submissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const getUserSubmissionsCount = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const questionId = req.params.questionId;

    const submissions = await Submission.find({ user: userId, question: questionId })
      .select('_id user question code language score status timestamp')
      .lean();

    const count = submissions.length;

    res.status(200).json({ count, submissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const getRanking = asyncHandler(async (req, res) => {
  try {
    // first fetch all submissions
    const submissions = await Submission.find()
      .populate('user', 'username')
      .select('user question timestamp')
      .lean();

    // second mapping to track the last attempt using timestamp for each user and question
    const lastAttemptMap = new Map();

    // filter and count the number of unique questions attempted by each user
    submissions.forEach((submission) => {
      const userId = submission.user._id.toString();
      const questionId = submission.question._id.toString();
      const timestamp = submission.timestamp;

      // Check if this is the last attempt for this user and question
      if (
        !lastAttemptMap.has(userId + questionId) ||
        timestamp > lastAttemptMap.get(userId + questionId)
      ) {
        lastAttemptMap.set(userId + questionId, timestamp);
      }
    });

    //calculate the number of unique questions attempted by each user
    const userAttemptsMap = new Map();
    lastAttemptMap.forEach((timestamp, userQuestionId) => {
      const userId = userQuestionId.substring(0, 24); // Extract the user ID from the combined key
      if (!userAttemptsMap.has(userId)) {
        userAttemptsMap.set(userId, 1);
      } else {
        userAttemptsMap.set(userId, userAttemptsMap.get(userId) + 1);
      }
    });

    // sorting users by the number of unique questions attempted (in descending order)
    const rankedUsers = [...userAttemptsMap.entries()]
      .sort((a, b) => b[1] - a[1]) // Sort in descending order based on the number of unique questions attempted
      .map(([userId, attempts]) => ({
        userId,
        attempts,
      }));

    // return statement
    res.status(200).json({ ranking: rankedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

  
});



module.exports = {
  submitCode,
  runCode,
  getUserSubmissions,
  getAllSubmissions,
  getUserSubmissionsCount,
  getRanking
};
