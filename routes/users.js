const express = require('express')
const router = express.Router({ mergeParams: true })
const multer = require('multer')

const { storage } = require('../cloudinary')
const upload = multer({ storage })

const catchAsync = require('../utils/catchAsync')
const { loggedIn } = require('../middleware')
const users = require('../controllers/users')

router.get('/profile', loggedIn, catchAsync(users.getMyProfile))

router.get('/searchUsers', loggedIn, catchAsync(users.searchUsers))

router.put('/updatePic', loggedIn, upload.single('image'), catchAsync(users.updatePic))

router.get('/:userId', loggedIn, catchAsync(users.getProfile))

router.put('/follow/:followId', loggedIn, catchAsync(users.follow))

router.put('/unfollow/:unfollowId', loggedIn, catchAsync(users.unfollow))



module.exports = router;
