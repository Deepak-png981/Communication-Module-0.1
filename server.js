const path = require('path');
const flash = require('connect-flash');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/userModel');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const authRoutes = require('./routes/authRoutes');
// require('dotenv').config();
// ./data/config.env
require('dotenv').config({ path: './data/config.env' });

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect("mongodb://127.0.0.1:27017/videoCallApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded request bodies

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            return done(null, false, { message: 'No user with that email' });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }
        } catch (e) {
            return done(e);
        }
    }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', authRoutes);
// app.get('/', checkAuthenticated, (req, res) => {
//     res.send('Welcome to Video Call App!');
// });
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});
app.get('/dashboard', checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'dashboard.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
