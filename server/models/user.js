import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    smm: { type: String, default: '' },
});

const User = mongoose.model('User', userSchema);

export default User;