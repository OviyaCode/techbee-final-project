const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('../env.js');

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

const resetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.send({ Status: "User not exists" })
    }
    const token = jwt.sign({ id: user._id }, "123456", { expiresIn: "1d" })

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    })

    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: 'Reset Password',
        text: `http://localhost:3000/reset-password/${user._id}/${token}`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            // console.log('Email sent: ' + info.response);
            return res.send({ 
                status: "Success",
                userId: user._id ,
                msg:"Email sent"
             })
        }
    })

})

const changePassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400)
        throw new Error("User not found")
    }
    else {
        jwt.verify(token, "123456", async (error, decoded) => {
            if (error) {
                res.json({ status: "Error with token" })
            }
            else {
                try {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);

                    // Update the password field in the user document
                    user.password = hashedPassword;
                    const updateUser = await user.save();

                    res.status(200).json({
                        updateUser
                    });
                } catch (err) {
                    res.status(500).json({ error: "Password update failed" });
                }
            }
        })
    }
});


module.exports = {
    registerUser,
    LoginUser,
    getMe,
    updateUser,
    deleteUser,
    getUsers,
    getUser,
    resetPassword,
    changePassword
}