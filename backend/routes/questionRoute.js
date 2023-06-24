const express = require('express');
const router = express.Router();

const { getQuestions,
        setQuestions,
        getQuestionsByCategory,
        updateQuestion,
        deleteQuestion,
        getSingleQuestion } =

        require('../controllers/questionController')

router.route('/')
        .get(getQuestions)
        .post(setQuestions)

router.route('/category/:categoryId')
        .get(getQuestionsByCategory)

router.route('/:id')
        .get(getSingleQuestion)
        .put(updateQuestion)
        .delete(deleteQuestion)

module.exports = router

/**
 * need a code to Find the lowest odd number in the array using java
 */