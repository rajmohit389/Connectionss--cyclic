const express = require('express')
const router = express.Router({ mergeParams: true });

const { validateComment, loggedIn, isAuthorisedComment } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const comments = require('../controllers/comments')

router.post('/', loggedIn, validateComment, catchAsync(comments.createComment))

router.put('/likeComment/:commentId', loggedIn, catchAsync(comments.likeComment))

router.put('/unlikeComment/:commentId', loggedIn, catchAsync(comments.unlikeComment))

router.delete('/:commentId', loggedIn, isAuthorisedComment, catchAsync(comments.deleteComment))

module.exports = router
