const Submission = require('../models/submissionModel');
const Question = require('../models/questionModel');
const axios = require('axios');
const asyncHandler = require('express-async-handler')

const submitCode = asyncHandler(async (req, res) => {

  try {
    const { submissionId, userId, code, questionId, languageId, score } = req.body;
    if (!req.body.submissionId || !req.body.userId || !req.body.submissionId || !req.body.questionId || !req.body.languageId || !req.body.score || !req.body.code) {
      res.status(404)
      throw new Error("You can't made this submission")
    }
    const submissionCode = await Submission.create({
      user: userId,
      question: questionId,
      submissionId: submissionId,
      code: req.body.code,
      language: req.body.languageId,
      score: req.body.score
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

    const inputs = testCases.map(testCase => testCase.input);
    const expectedOutputs = testCases.map(testCase => testCase.output);

    const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
      source_code: code,
      language_id: languageId,
      stdin: JSON.stringify(inputs),
      expected_output: JSON.stringify(expectedOutputs),
      expected_output_files: [],
      callback_url: '',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      }
    });

    let submissionOutputs = [];
    let testResult = null;

    // Wait for submission to finish executing
    while (true) {
      const submissionStatusResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${response.data.token}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        }
      });

      if (submissionStatusResponse.data.status.id <= 2) {
        // Submission is still running, wait for 1 second before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        // Submission has finished executing, get its output
        const stdout = submissionStatusResponse.data.stdout;
        if (stdout) {
          if (stdout.includes('\n')) {
            submissionOutputs = stdout.split('\n');
          } else {
            submissionOutputs.push(stdout)
          }
        }
        submissionOutputs = submissionStatusResponse.data.stdout.split('\n');
        break;
      }
    }

    for (let i = 0; i < submissionOutputs.length; i++) {
      const testCase = testCases[i];

      if (!testCase || !testCase.input || !testCase.output) {
        continue;
      }

      const expectedOutput = testCase.output;
      const submissionOutput = submissionOutputs[i];

      testResult = {
        userId: userId,
        input: testCase.input,
        expectedOutput: expectedOutput,
        submissionOutput: submissionOutput,
        result: expectedOutput === submissionOutput ? 'Pass' : 'Fail'
      };

      break; // Stop at the first valid test case
    }

    return res.status(200).json({ message: 'Code executed successfully', testResult: testResult, submissionId: response.data.token });
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




module.exports = {
  submitCode,
  runCode,
  getUserSubmissions,
  getAllSubmissions
};
