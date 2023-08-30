import mongoose from 'mongoose';

const postSchemaTemporal = mongoose.Schema({
    repeat: Number,
    active: {
        type: Boolean,
        default: true
    },
    title: String,
    message: String,
    name: String,
    creator: String,
    type: String,
    location: [Number],
    tags: [String],
    selectedFile: String,
    privacy: String,
    visual: {
        type: Number,
        default: 0,
    },
    likes: {
        type: [String],
        default: [],
    },
    dislikes: {
        type: [String],
        default: [],
    },
    comments: {
        type: [String],
        default: [],
    },
    destinatari: {
        type: [String],
        default: [],
    },
    destinatariPrivati: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

const PostMessageTemporal = mongoose.model('PostMessageTemporal', postSchemaTemporal);

export default PostMessageTemporal;