import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    id: { type: String },
    quotaGiornaliera: { type: Number, default: 100 },
    quotaRestante: { type: Number, default: 100 },
});

const User = mongoose.model('User', userSchema);

export default User;