const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getGoogleLogin } = require('../controllers/users')
const passport = require('passport')
require('../passport-setup')

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/google',  passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('google/callback', passport.authenticate('google', { failureRedirect: '/failed' }), getGoogleLogin);

module.exports = router