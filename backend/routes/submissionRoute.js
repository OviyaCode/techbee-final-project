const express = require('express');
const router = express.Router();
const {submitCode, runCode, getUserSubmissions, getAllSubmissions} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:questionId').post(runCode)
router.route('/save/:questionId').post(submitCode)
router.route('/:userId').get(getUserSubmissions)
router.route('/').get(getAllSubmissions)
        
module.exports = router;