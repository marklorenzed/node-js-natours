const { promisify } = require('util')
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const bcrypt = require("bcryptjs");

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    // check if email and password exist
    if(!email || !password) {
        return next(new AppError("Please provide email and password" ,400))
    }
    // check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorret email or password", 401));
    }

    // if everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    //1 getting token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1]
    }

    if(!token) {
        return next(new AppError("You are not logged in", 401))
    }
    //2 verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    //3 check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) return next(new AppError("The user belonging to this token no longer exist.", 401))

    //4 check if user changed password after token was issued
    if(currentUser.changedPasswordAfter(decoded.iat)) return next(new AppError("User recently changed password. please login again.", 401))

    req.user = currentUser
    next();
})