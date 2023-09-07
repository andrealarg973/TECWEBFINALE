import mongoose from 'mongoose';

const channelSchema = mongoose.Schema({
    value: String,
    label: String,
    desc: {
        type: String,
        default: ''
    },
    privacy: {
        type: String,
        default: 'public'
    },
    owner: {
        type: [String],
        default: []
    },
    write: {
        type: [String],
        default: []
    },
    read: {
        type: [String],
        default: []
    }
});

const ChannelSchema = mongoose.model('ChannelSchema', channelSchema);

export default ChannelSchema;