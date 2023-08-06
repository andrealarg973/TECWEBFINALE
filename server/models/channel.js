import mongoose from 'mongoose';

const channelSchema = mongoose.Schema({
    name: String,
    privacy: {
        type: String,
        default: 'public'
    }
});

const ChannelSchema = mongoose.model('ChannelSchema', channelSchema);

export default ChannelSchema;