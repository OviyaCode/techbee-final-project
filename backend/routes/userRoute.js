const express = require('express');
const router = express.Router();
const {registerUser, LoginUser, getMe,updateUser,deleteUser, getUsers, getUser, resetPassword, changePassword} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/forgot-password', resetPassword)
router.put('/reset-password/:id/:token', changePassword)
router.post('/login', LoginUser);
router.get('/me', protect, getMe);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);
router.get('/', getUsers);
router.get('/:id', getUser);
module.exports = router;