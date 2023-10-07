const express = require('express');
const router = express.Router();
const {submitCode, runCode, getUserSubmissions, getAllSubmissions, getUserSubmissionsCount, getRanking, } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');


router.route('/rank').get(getRanking);
router.route('/:questionId').post(runCode)
router.route('/save/:questionId').post(submitCode)
router.route('/:userId').get(getUserSubmissions)
router.route('/').get(getAllSubmissions)
router.route('/:userId/:questionId').get(getUserSubmissionsCount)


        
module.exports = router;