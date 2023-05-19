const express = require('express')
const passport = require('passport')
const router = express.Router()
const { loggedIn, validateUser } = require('../middleware')
const auth = require('../controllers/auth')
const multer = require('multer')

const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.get('/getloggedInUser', (req, res) => {
    res.status(200).json({ user: (req.user) })
})

router.route('/register')
    .post(upload.single('image'), validateUser, auth.registerUser)

router.route('/login')
    .post(passport.authenticate('local', { keepSessionInfo: true }), auth.loginUser)

router.get('/logout', loggedIn, auth.logoutUser)

module.exports = router
