import mongoose from 'mongoose';

const DAY = 200;
const WEEK = DAY * 5;
const MONTH = WEEK * 3;

const quotaSchema = mongoose.Schema({
    user: String,
    day: {
        type: Number,
        default: DAY
    },
    week: {
        type: Number,
        default: WEEK
    },
    month: {
        type: Number,
        default: MONTH
    },
    extraDay: {
        type: Number,
        default: 0
    },
    extraWeek: {
        type: Number,
        default: 0
    },
    extraMonth: {
        type: Number,
        default: 0
    },
});

const QuotaSchema = mongoose.model('QuotaSchema', quotaSchema);

export default QuotaSchema;