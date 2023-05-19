const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const passportLocalMongoose = require('passport-local-mongoose')

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return (this.url).replace('/upload', '/upload/w_200')
})

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    pic: {
        type: ImageSchema,
        default: { url: "https://res.cloudinary.com/mohit2002/image/upload/v1680443414/Social/mcjh4bugfsm2qijjt4p0_abrhij.webp", filename: "Social/mcjh4bugfsm2qijjt" }
    },
    followers: [{ type: ObjectId, ref: 'User' }],
    followings: [{ type: ObjectId, ref: 'User' }]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)
