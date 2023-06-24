const asyncHandler = require('express-async-handler')
const quizCategory = require('../models/questionCategoryModel')

const getQuizCategories = asyncHandler(async (req, res) => {
    const quizCat = await quizCategory.find({})
    res.status(200).json({
        count: quizCat.length,
        quizCat:quizCat

    })
})

const getSingleQuizCategory = asyncHandler(async(req,res)=>{
    const quizCat = await quizCategory.findById(req.params.id)
    if(!quizCat){
        res.status(400)
        throw new Error('Quiz category not found')
    }
    res.status(200).json({
        quizCat: quizCat
    })
})

const setQuizCategories = asyncHandler(async (req, res) => {
    if (!req.body.name) {
        res.status(404)
        throw new Error('Please enter the required fields')
    }
    const quizCat = await quizCategory.create({
        name: req.body.name,
        type: req.body.type,
        difficulty:req.body.difficulty
    })
    res.status(200).json({
        quizCat:quizCat
    })
})
const putQuizCategories = asyncHandler(async (req, res) => {

    const quizCat = await quizCategory.findById(req.params.id)
    if (!quizCat) {
        res.status(400)
        throw new Error('Quiz category not found')
    }
    const updateQuizCat = await quizCategory.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json({
        updateCat:updateQuizCat
    })
})
const deleteQuizCategories = asyncHandler(async (req, res) => {

    const quizCat = await quizCategory.findById(req.params.id)
    if (!quizCat) {
        res.status(400)
        throw new Error('Quiz category not found')
    }
    await quizCat.deleteOne();

    res.status(200).json({
        message: `Quiz Category deleted ${req.params.id}`
    })
})

module.exports = {
    getQuizCategories,
    getSingleQuizCategory,
    setQuizCategories,
    putQuizCategories,
    deleteQuizCategories
}