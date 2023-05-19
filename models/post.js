const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const { cloudinary } = require('../cloudinary')
const Comment = require('./comment')

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return (this.url).replace('/upload', '/upload/w_200')
})

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [ImageSchema],
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [{ type: ObjectId, ref: 'Comment' }],
    postedBy: {
        type: ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

PostSchema.post('remove', async (doc) => {
    if (doc) {
        await Comment.deleteMany({
            _id: { $in: doc.comments }
        })
        doc.images.forEach(async (img) => {
            await cloudinary.uploader.destroy(img.filename);
        })
    }
})

module.exports = mongoose.model('Post', PostSchema)