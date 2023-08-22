// controllers/authController.js

const User = require('../models/userModel');
const passport = require('passport');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error("Error during registration:", error);
        res.redirect('/register');
    }
};

exports.login = passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
});


// ... Additional methods for logout, etc.
