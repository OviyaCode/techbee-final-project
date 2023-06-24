const express = require('express');
const router = express.Router();

const { getResult, getResultsAll, setResult } =
    require('../controllers/resultController');

router.route('/:submissionId')
    .post(setResult)
router.route('/').get(getResultsAll)
router.route('/:userId')
    .get(getResult)

module.exports = router;