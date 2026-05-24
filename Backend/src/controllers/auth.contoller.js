const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require("../models/blacklist.model")

async function registerUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await userModel.findOne({ $or: [{ email }, { name }] });

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const newuser = await userModel.create({
        name,
        email,
        password: hash
    });

    const token = jwt.sign(
        { userId: newuser._id, name: newuser.name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie("token", token);

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: newuser._id,
            name: newuser.name,
            email: newuser.email
        }
    });
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
        { userId: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    res.cookie("token", token);

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
}

async function logoutUSerController(req,res){
    const token = req.cookies.token
    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")

    res.status(200).json({
        message:"user logged out successfully"
    })
}

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
}

module.exports = {
    registerUser,
    loginUser,
    logoutUSerController,
    getMeController
};