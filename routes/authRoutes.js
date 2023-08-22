// routes/authRoutes.js
const path = require('path');
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
}

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
});

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});


// ... More routes for handling POST requests, logging out, etc.
router.post('/register', register);
router.post('/login', login);
module.exports = router;
