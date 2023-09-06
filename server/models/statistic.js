import mongoose from 'mongoose';

const statisticSchema = mongoose.Schema({
    userId: String,
    popularPosts: {
        type: Number,
        default: 0,
    },
    impopularPosts: {
        type: Number,
        default: 0,
    },
    controversialPosts: {
        type: Number,
        default: 0,
    },
    maxPopularPosts: {
        type: Number,
        default: 0,
    },
    maxImpopularPosts: {
        type: Number,
        default: 0,
    },
    maxControversialPosts: {
        type: Number,
        default: 0,
    },
});

const StatisticSchema = mongoose.model('StatisticSchema', statisticSchema);

export default StatisticSchema;