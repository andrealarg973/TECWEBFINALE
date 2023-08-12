import mongoose from 'mongoose';

const channelSchema = mongoose.Schema({
    value: String,
    label: String,
    privacy: {
        type: String,
        default: 'public'
    },
    owner: {
        type: [String],
        default: []
    },
    participants: {
        type: [String],
        default: []
    }
});

const ChannelSchema = mongoose.model('ChannelSchema', channelSchema);

export default ChannelSchema;