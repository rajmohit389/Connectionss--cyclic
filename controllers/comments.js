const Post = require('../models/post')
const Comment = require('../models/comment')

module.exports.createComment = async (req, res) => {
    const post = await Post.findById(req.params.postId)
    if (!post) {
        res.status(404).json({ error: 'Cannot find the post' })
    }
    const newComment = new Comment(req.body)
    newComment.commentedBy = req.user._id
    await newComment.save()
    post.comments.push(newComment)
    await post.save()
    newComment.commentedBy = req.user
    res.status(200).json({ comment: newComment })
}

module.exports.likeComment = async (req, res) => {
    const comment = await Comment.findByIdAndUpdate(req.params.commentId, { $addToSet: { likes: req.user._id } }, { new: true })
    if (!comment) {
        res.status(404).json({ error: 'Cannot find the comment' })
    }
    res.status(200).json({ likes: comment.likes })
}

module.exports.unlikeComment = async (req, res) => {
    const comment = await Comment.findByIdAndUpdate(req.params.commentId, { $pull: { likes: req.user._id } }, { new: true })
    if (!comment) {
        res.status(404).json({ error: 'Cannot find the comment' })
    }
    res.status(200).json({ likes: comment.likes })
}

module.exports.deleteComment = async (req, res) => {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
        res.status(404).json({ error: 'Cannot find the comment' })
    }
    await Post.findByIdAndUpdate(req.params.postId, { $pull: { comments: comment._id } })
    await comment.remove()
    res.status(200).json({ message: "Successfully deleted" })
}
