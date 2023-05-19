const express = require('express')
const router = express.Router({ mergeParams: true });
const multer = require('multer')

const { storage } = require('../cloudinary')
const upload = multer({ storage })

const catchAsync = require('../utils/catchAsync')
const { validatePost, loggedIn, isAuthorisedPost } = require('../middleware')
const posts = require('../controllers/posts')

router.get('/allposts', loggedIn, catchAsync(posts.allPosts))

router.get('/getsubposts', loggedIn, catchAsync(posts.subPosts))

router.post('/', loggedIn, upload.array('images'), validatePost, catchAsync(posts.createPost))

router.put('/likePost/:postId', loggedIn, catchAsync(posts.likePost))

router.put('/unlikePost/:postId', loggedIn, catchAsync(posts.unlikePost))


router.route('/:postId')
    .get(loggedIn, catchAsync(posts.getPost))
    .put(loggedIn, upload.array('images'), isAuthorisedPost, validatePost, catchAsync(posts.editPost))
    .delete(loggedIn, isAuthorisedPost, catchAsync(posts.deletePost))

module.exports = router;
