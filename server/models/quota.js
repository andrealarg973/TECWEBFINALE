import mongoose from 'mongoose';

const quotaSchema = mongoose.Schema({
    user: String,
    quota: {
        type: Number,
        default: 0
    }
});

const QuotaSchema = mongoose.model('QuotaSchema', quotaSchema);

export default QuotaSchema;