const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    commentedBy: {
        type: ObjectId,
        ref: 'User'
    },
    likes: [{ type: ObjectId, ref: 'User' }],
}, { timestamps: true })

module.exports = mongoose.model('Comment', CommentSchema);