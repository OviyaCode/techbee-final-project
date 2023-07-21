const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Result = require('../models/resultModel');
const Submission = require('../models/submissionModel');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body

    if (!email || !password || !name) {
        res.status(400)
        throw new Error('Please fill all fields')
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400)
        throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const defaultRole = role ? role : 'student';

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role
    })

    if (user) {
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateJWT(user.id)
        })
    }
    else {
        res.status(400)
        throw new Error('Internal server error')
    }
})

const LoginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            message: `Successfully logged in`,
            token: generateJWT(user.id),
            role: user.role,
            userId: user.id
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

const getMe = asyncHandler(async (req, res) => {
    const { _id, email, name } = await User.findById(req.user.id);
    res.status(200).json({
        id: _id,
        name,
        email
    })
})


// /api/user/:id
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400)
        throw new Error("User not found");
    }
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword;
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json({
        updateUser
    })
})

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(400)
        throw new Error('User not found')
    }
    res.status(200).json({
        user: user
    })
})

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.status(200).json({
        // count: users.length,
        users,
        // message: 'users showing'
    })

})
// /api/user/:id
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400)
        throw new Error("User not found");
    }
    await Result.deleteMany({ user: user });

    // Delete the associated submissions
    await Submission.deleteMany({ user: user });

    // Delete the user
    await user.deleteOne();

    res.status(200).json({
        message: `User deleted ${req.params.id}`
    })
})
const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
}

module.exports = {
    registerUser,
    LoginUser,
    getMe,
    updateUser,
    deleteUser,
    getUsers,
    getUser
}