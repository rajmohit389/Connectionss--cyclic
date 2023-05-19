const User = require('../models/user')
const Post = require('../models/post')
const { cloudinary } = require('../cloudinary')

module.exports.getProfile = async (req, res) => {
    const user = await User.findOne({ _id: req.params.userId })
    if (!user) {
        res.status(404).json({ error: 'Cannot find the user' })
    }
    const posts = await Post.find({ postedBy: req.params.userId }).populate("postedBy").select("-comments").sort('-createdAt')
    res.status(200).json({ user, posts })
}

module.exports.getMyProfile = async (req, res) => {
    const user = await User.findById(req.user._id)
    const posts = await Post.find({ postedBy: req.user._id }).populate("postedBy").select("-comments").sort('-createdAt')
    if (!user) {
        res.status(404).json({ error: "Cannot find the user" })
    }
    if (!posts) {
        res.status(404).json({ error: 'Cannot find the posts' })
    }
    res.status(200).json({ user, posts });
}

module.exports.follow = async (req, res) => {
    // console.log(req.params.followId)
    const otherUser = await User.findByIdAndUpdate(req.params.followId, { $addToSet: { followers: req.user._id } }, { new: true })
    if (!otherUser) {
        res.status(400).json({ error: 'No user found to follow' })
    }
    const loggedInUser = await User.findByIdAndUpdate(req.user._id, { $addToSet: { followings: otherUser._id } }, { new: true })
    req.user.followings = loggedInUser.followings
    req.user.followers = loggedInUser.followers
    res.status(200).json({ otherUser })
}

module.exports.unfollow = async (req, res) => {
    const otherUser = await User.findByIdAndUpdate(req.params.unfollowId, { $pull: { followers: req.user._id } }, { new: true })
    if (!otherUser) {
        res.status(400).json({ error: 'No user found to unfollow' })
    }
    const loggedInUser = await User.findByIdAndUpdate(req.user._id, { $pull: { followings: otherUser._id } }, { new: true })
    req.user.followers = loggedInUser.followers
    req.user.followings = loggedInUser.followings
    res.status(200).json({ otherUser })
}

module.exports.updatePic = async (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "Enter the file first" })
    }
    const loggedInUser = await User.findById(req.user._id)
    const filename = loggedInUser.pic.filename
    loggedInUser.pic = { url: req.file.path, filename: req.file.filename }
    await loggedInUser.save()
    await cloudinary.uploader.destroy(filename)
    res.status(200).json({ pic: loggedInUser.pic, message: "Successfully Updated the Pic" })
}

module.exports.searchUsers = async (req, res) => {
    let userPattern = new RegExp("^" + req.query.search)
    const users = await User.find({ username: { $regex: userPattern } })
    res.status(200).json({ users })
}
