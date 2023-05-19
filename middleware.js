
const Post = require('./models/post')
const Comment = require('./models/comment')

module.exports.validatePost = (req, res, next) => {
    if (!req.body.title || !req.body.description) {
        res.status(400).json({ error: "Fields can't be empty" })
    }
    else {
        next()
    }
}

module.exports.validateComment = (req, res, next) => {
    if (!req.body.text) {
        res.status(400).json({ error: 'Empty Section' })
    }
    else {
        next()
    }
}

module.exports.validateUser = (req, res, next) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(400).json({ error: "Fields can't be empty" })
    }
    next();
}

module.exports.loggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(400).json({ error: 'Not logged In' })
    }
    next()
}


module.exports.isAuthorisedPost = async (req, res, next) => {
    const { postId } = req.params;
    const post = await Post.findById(postId)
    if (!post || !post.postedBy.equals(req.user._id)) {
        res.status(400).json({ error: 'You do not have access for it' })
    }
    next()
}

module.exports.isAuthorisedComment = async (req, res, next) => {
    const { postId, commentId } = req.params;
    const comment = await Comment.findById(commentId)
    if (!comment || !comment.commentedBy.equals(req.user._id)) {
        res.status(400).json({ error: 'You do not have access for it' })
    }
    next()
}
