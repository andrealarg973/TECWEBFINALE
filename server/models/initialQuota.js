import mongoose from 'mongoose';

const DAY = 200;
const WEEK = DAY * 5;
const MONTH = WEEK * 3;

const initialQuotaSchema = mongoose.Schema({
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
});

const InitialQuotaSchema = mongoose.model('InitialQuotaSchema', initialQuotaSchema);

export default InitialQuotaSchema;