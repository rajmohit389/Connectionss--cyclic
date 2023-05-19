const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')
const { cloudinary } = require('../cloudinary')

module.exports.allPosts = async (req, res) => {
    const posts = await Post.find({}).populate("postedBy").select("-comments").sort('-createdAt')
    if (!posts) {
        res.status(404).json({ error: 'Cannot find the posts' })
    }
    res.status(200).json({ posts });
}

module.exports.subPosts = async (req, res) => {
    const posts = await Post.find({ postedBy: { $in: req.user.followings } }).populate("postedBy").select("-comments").sort('-createdAt')
    if (!posts) {
        res.status(404).json({ error: 'Cannot find the posts' })
    }
    res.status(200).json({ posts });
}


module.exports.getPost = async (req, res) => {
    const post = await Post.findById(req.params.postId).populate("postedBy").populate({
        path: 'comments',
        populate: {
            path: 'commentedBy'
        }
    })
    if (!post) {
        res.status(404).json({ error: 'Cannot find the post' })
    }
    res.status(200).json({ post })
}

module.exports.createPost = async (req, res) => {
    const newPost = new Post(req.body)
    newPost.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
    newPost.postedBy = req.user._id
    await newPost.save()
    res.status(200).json({ post: newPost, message: "Successfully created a post" })
}

module.exports.editPost = async (req, res) => {
    const { title, description } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) {
        res.status(404).json({ error: 'Cannot find the post' })
    }
    post.title = title
    post.description = description
    if (req.files) {
        const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }))
        post.images.push(...imgs)
    }
    await post.save()
    if (req.body.deleteImages) {
        await Post.findByIdAndUpdate(req.params.postId, { $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        Array.from(req.body.deleteImages).forEach(async (fileName) => {
            await cloudinary.uploader.destroy(fileName)
        });
    }
    res.status(200).json({ message: "Successfully Edited the post" })
}

module.exports.likePost = async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.postId, { $addToSet: { likes: req.user._id } }, { new: true })
    if (!post) {
        res.status(404).json({ error: 'Cannot find the post' })
    }
    res.status(200).json({ likes: post.likes });
}

module.exports.unlikePost = async (req, res, next) => {
    const post = await Post.findByIdAndUpdate(req.params.postId, { $pull: { likes: req.user._id } }, { new: true })
    if (!post) {
        res.status(404).json({ error: 'Cannot find the post' })
    }
    res.status(200).json({ likes: post.likes })
}

module.exports.deletePost = async (req, res) => {
    const post = await Post.findOne({ _id: req.params.postId })
    if (!post) {
        res.status(404).json({ error: 'Cannot find the post' })
    }
    await post.remove()
    res.status(200).json({ message: "Successfully deleted the post" })
}
