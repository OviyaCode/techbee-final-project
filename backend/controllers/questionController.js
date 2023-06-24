const asyncHandler = require('express-async-handler');
const Question = require('../models/questionModel');
const QuestionCategory = require('../models/questionCategoryModel')
const mongoose = require('mongoose')

const getQuestions = asyncHandler(async (req, res) => {
  const questions = await Question.aggregate([
    {
      $lookup: {
        from: 'questioncategories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryData',
      },
    },
  ]);

  res.status(200).json({
    message: 'Questions showing',
    count: questions.length,
    questions: questions,
  });
})

const getSingleQuestion = asyncHandler(async (req, res) => {
  const question = await Question.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
    },
    {
      $lookup: {
        from: 'questioncategories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryData',
      },
    },
    {
      $project: {
        categoryData: {
          $arrayElemAt: ['$categoryData', 0],
        },
        // Include other fields you want to retrieve from the question
        // For example, title, description, testCases, etc.
        title: 1,
        description: 1,
        testCases: 1,
      },
    },
  ]);

  if (!question || question.length === 0) {
    res.status(400);
    throw new Error('Question not found');
  }

  res.status(200).json({
    question: question[0],
  });
});


const setQuestions = asyncHandler(async (req, res) => {
  if (!req.body.category || !req.body.title || !req.body.description || !req.body.testCases) {
    res.status(404)
    throw new Error('Please enter the required fields')
  }
  const question = await Question.create({
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    testCases: req.body.testCases,
    input: req.body.testCases.input,
    output: req.body.testCases.output

  })
  res.json({
    message: 'question created',
    question: question
  })
})
// /api/questions/category/:categoryId
const getQuestionsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await QuestionCategory.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const questions = await Question.find({ category: categoryId }).select(
    // '-category' , 
    'title description testCases input output'
  );

  const result = {
    // count: questions.length,
    category: category.name,
    questions
  };
  res.status(200).json(result)
})

// /api/questions/:id
const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    res.status(400)
    throw new Error('Question not found');
  }
  const updateQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true })

  res.status(200).json({
    updateQuestion
  })
});

// /api/questions/:id

const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    res.status(400)
    throw new Error('Question not found');
  }
  await question.deleteOne();

  res.status(200).json({
    message: `Question deleted ${req.params.id}`
  })
});

module.exports = {
  getQuestions,
  setQuestions,
  getQuestionsByCategory,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion
}