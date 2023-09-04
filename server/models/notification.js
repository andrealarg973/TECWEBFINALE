import mongoose from 'mongoose';

const notificationlSchema = mongoose.Schema({
    postId: String,
    userId: String,
    sender: String,
    content: String,
    read: {
        type: Boolean,
        default: false
    },
    createdAt: Date,

});

const NotificationlSchema = mongoose.model('NotificationlSchema', notificationlSchema);

export default NotificationlSchema;