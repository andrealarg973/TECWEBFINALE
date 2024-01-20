import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import User from '../models/user.js';
import QuotaSchema from '../models/quota.js';
import PostMessage from '../models/postMessage.js';
import InitialQuotaSchema from '../models/initialQuota.js';
import NotificationlSchema from '../models/notification.js';
import StatisticSchema from '../models/statistic.js';
import ChannelSchema from '../models/channel.js';

const router = express.Router();

export const getUsers = async (req, res) => {
    const id = req.params.id;
    //console.log(id);

    try {
        const users = await User.find({ $and: [{ $or: [{ role: 'user' }, { role: 'vip' }] }, { _id: { $ne: id } }] }); // get all users (except mod, smm and yourself)
        const values = users.map((user) => ({ value: String(user._id), label: user.name }));
        //console.log(values);
        res.status(200).json(values);
    } catch (error) {
        console.log(error);
    }
}

export const getSMM = async (req, res) => {
    try {
        const smms = await User.find({ role: 'smm' });
        const takenSmms = await User.find({ $and: [{ smm: { $ne: '' } }, { smm: { $exists: true } }] });
        //console.log(smms);
        const filter = takenSmms.map((user) => user.smm);
        //console.log(filter);
        const values = smms.map((user) => (filter.includes(String(user._id)) ? {} : { value: String(user._id), label: user.name }))
            .filter((user) => Object.keys(user).length !== 0);  // get all free SMMs
        //const values = smms.map((user) => ({ value: String(user._id), label: user.name }));
        //console.log(values);
        res.status(200).json(values);
    } catch (error) {
        console.log(error);
    }
}

export const setSMM = async (req, res) => {
    const vipId = req.params.id;
    const smmId = req.body.id;
    //console.log('params', req.params);
    //console.log('body', req.body);
    try {
        //const vip = await User.findById(vipId);
        //console.log(vip);
        //const smm = await User.findById(smmId);

        //const updatedPost = await PostMessage.findByIdAndUpdate(id, { visual: post.visual + 1 }, { new: true });
        const updateVip = await User.findByIdAndUpdate(vipId, { smm: smmId });
        //const updateSmm = await User.findByIdAndUpdate(smmId, { vip: vip._id });


        //console.log(updateVip);
        //console.log(updateSmm);
        res.status(200).json({ result: updateVip });
    } catch (error) {
        console.log(error);
    }
}

export const getMySMM = async (req, res) => {
    const id = req.params.id;
    //console.log('id', id);
    try {
        const user = await User.findById(id);
        if (user.smm !== '' && user.smm) {
            const smm = await User.findById(user.smm);
            //console.log(smm);
            res.status(200).json({ value: smm._id, label: smm.name });
        } else {
            res.status(200).json({ value: '', label: '' });
        }
    } catch (error) {
        console.log(error);
    }
}

async function mailSignup(email) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
        port: 465, // Port for SMTP (usually 465)
        secure: true, // Usually true if connecting to port 465
        auth: {
            user: "squealermail@gmail.com", // Your email address
            pass: "dgafhznykxdussac", // Password (for gmail, your app password)
            //  For better security, use environment variables set on the server for these values when deploying
        },
    });

    // Define and send message inside transporter.sendEmail() and await info about send from promise:
    let info = await transporter.sendMail({
        from: 'squealermail@gmail.com',
        to: email,
        subject: "Welcome to Squealer",
        html: `
        <h1>Your squealer account was succesfully created!</h1>
        <p>We are looking forward to see your first post!</p>
        `,
    });

    //console.log(info.messageId);
}

async function mailReset(email, newPassword) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
        port: 465, // Port for SMTP (usually 465)
        secure: true, // Usually true if connecting to port 465
        auth: {
            user: "squealermail@gmail.com", // Your email address
            pass: "dgafhznykxdussac", // Password (for gmail, your app password) // jeny ctsp xxif vngk, old: esdaezkqmkcimosd
            //  For better security, use environment variables set on the server for these values when deploying
        },
    });

    // Define and send message inside transporter.sendEmail() and await info about send from promise:
    let info = await transporter.sendMail({
        from: 'squealermail@gmail.com',
        to: email,
        subject: "Password Reset",
        html: `
        <h1>Your passwor has been resetted</h1>
        <p>New password: ${newPassword}</p>
        `,
    });

    //console.log(info.messageId);
}

async function mailDelete(email) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
        port: 465, // Port for SMTP (usually 465)
        secure: true, // Usually true if connecting to port 465
        auth: {
            user: "squealermail@gmail.com", // Your email address
            pass: "dgafhznykxdussac", // Password (for gmail, your app password)
            //  For better security, use environment variables set on the server for these values when deploying
        },
    });

    // Define and send message inside transporter.sendEmail() and await info about send from promise:
    let info = await transporter.sendMail({
        from: 'squealermail@gmail.com',
        to: email,
        subject: "Account Deleted",
        html: `
        <h1>As you requested your account has been deleted.</h1>
        <p>We are sorry that you are not with us anymore, but we still hope to see you again someday!</p>
        <p>Squearel staff</p>
        `,
    });

    //console.log(info.messageId);
}

export const deleteAccount = async (req, res) => {
    const { _id } = req.body;
    //console.log(id);
    //console.log(data);
    try {
        const existingUser = await User.findById(_id);

        if (!existingUser) return res.status(400).json({ message: "User doesn't exists" });

        const userPosts = await PostMessage.find({ creator: existingUser._id });
        userPosts.map(async (post) => {
            await PostMessage.findByIdAndRemove(post._id);
        });

        const getParticipatingChannels = await ChannelSchema.find({ $or: [{ write: { $in: existingUser._id } }, { read: { $in: existingUser._id } }] });
        getParticipatingChannels.map(async (c) => {
            await ChannelSchema.findByIdAndUpdate(c._id, { write: c.write.filter((u) => u !== existingUser._id), read: c.read.filter((u) => u !== existingUser._id) }, { new: true });
        });

        const getOwnedChannels = await ChannelSchema.find({ owner: { $in: existingUser._id } });
        getOwnedChannels.map(async (c) => {
            if (c.owner.length > 1) {
                console.log("newowners ", c.owner.filter((u) => u !== existingUser._id));
                await ChannelSchema.findByIdAndUpdate(c._id, { owner: c.owner.filter((u) => u !== existingUser._id) }, { new: true });
            } else {
                if (c.write.length > 1) { // give channel to first participant
                    console.log("write ", [c.write[0]]);
                    await ChannelSchema.findByIdAndUpdate(c._id, { owner: [c.write[0]] }, { new: true });
                } else if (c.read.length > 1) {
                    console.log("read ", [c.read[0]]);
                    await ChannelSchema.findByIdAndUpdate(c._id, { owner: [c.read[0]] }, { new: true });
                } else {
                    const lottery = await User.find({ $and: [{ $or: [{ role: 'user' }, { role: 'vip' }] }, { _id: { $ne: existingUser._id } }] });
                    const num = Math.floor(Math.random() * lottery.length); // give the channel to a random user
                    console.log("random ", [[String(lottery[num]._id)]]);
                    await ChannelSchema.findByIdAndUpdate(c._id, { owner: [String(lottery[num]._id)] }, { new: true });
                }
            }
        });

        await User.findByIdAndRemove(existingUser._id);

        mailDelete(existingUser.email);

        res.status(200).json(existingUser);

    } catch (error) {
        console.log(error);
    }
}

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'secret', { expiresIn: "2h" });

        //mail(existingUser.email).catch(err => console.log(err));

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName, picture, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "User already exists" });

        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" });

        const hashedPassword = await bcrypt.hash(password, 12);

        let temp = firstName + " " + lastName;

        const result = await User.create({ email, password: hashedPassword, name: temp, picture, role });

        const initialQuota = await InitialQuotaSchema.findOne();

        await QuotaSchema.create({ user: result._id, day: initialQuota.day, week: initialQuota.week, month: initialQuota.month });
        await StatisticSchema.create({ userId: result._id });

        mailSignup(result.email);

        //console.log(result);

        const token = jwt.sign({ email: result.email, id: result._id }, 'secret', { expiresIn: "10h" });

        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!!!!" });
        console.log(error);
    }
}

function generateRandomPassword(length) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars.charAt(randomIndex);
    }

    return password;
}

export const passwordReset = async (req, res) => {
    const { email } = req.body;
    //console.log(id);
    //console.log(data);
    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) return res.status(400).json({ message: "User doesn't exists" });

        //console.log(hashedPassword);
        //console.log(currentUser.password);

        const newPassword = generateRandomPassword(8);

        const newHashedPassword = await bcrypt.hash(newPassword, 12);

        const newUser = await User.findByIdAndUpdate(existingUser._id, { password: newHashedPassword }, { new: true });

        mailReset(newUser.email, newPassword);

        res.status(200).json(newUser);

    } catch (error) {
        console.log(error);
    }
}

export const changePassword = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    //console.log(id);
    //console.log(data);
    try {
        const currentUser = await User.findById(id);
        const hashedPassword = await bcrypt.hash(data.oldPassword, 12);

        //console.log(hashedPassword);
        //console.log(currentUser.password);

        const isPasswordCorrect = await bcrypt.compare(data.oldPassword, currentUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Passwords don't match" });

        const newHashedPassword = await bcrypt.hash(data.newPassword, 12);

        const newUser = await User.findByIdAndUpdate(currentUser._id, { password: newHashedPassword }, { new: true });

        res.status(200).json(newUser);

    } catch (error) {
        console.log(error);
    }
}


export const updateQuota = async (req, res) => {
    //console.log(req.body);
    const id = req.body.user;
    //const quota = req.body.quota;
    //console.log(quota);
    //if (quota < 0) res.status(500).json({ message: "You exceeded your quota!!!!" });

    try {
        const message = new RegExp(id, 'i');

        const temp = await QuotaSchema.findOne({ $or: [{ user: message }] });
        //console.log('USER', temp);
        //temp.quota += quota;
        //console.log('USER', temp);

        temp.extraDay += temp.day;
        temp.extraWeek += temp.week;
        temp.extraMonth += temp.month;

        /*
        const user = await User.findById(id);
        user.quotaRestante = quota;
        */
        await QuotaSchema.findByIdAndUpdate(temp._id, temp, { new: true });

        res.status(200).json({ result: temp });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!!!!" });
        console.log(error);
    }
}

export const getCar = async (req, res) => {
    const { user } = req.body;
    //console.log('BODY', req.body);
    try {
        const msg = new RegExp(user, 'i');

        const temp = await QuotaSchema.findOne({ user: msg });
        //console.log('TEMP: ', temp);

        res.status(200).json(temp);
    } catch (error) {
        console.log(error);
    }
}

export const getNotifications = async (req, res) => {
    const user = req.params.id;
    try {
        const notifications = await NotificationlSchema.find({ $and: [{ userId: user }, { read: false }] }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.log(error);
    }
}

export const readNotification = async (req, res) => {
    const id = req.body.id;
    try {
        const readNotify = await NotificationlSchema.findByIdAndUpdate(id, { read: true }, { new: true });
        res.status(200).json(readNotify);
    } catch (error) {
        console.log(error);
    }
}

export const getQuotas = async (req, res) => {
    const id = req.params.id;

    try {
        const dateDay = new Date();
        dateDay.setHours(0, 0, 0, 0);

        const dateWeek = new Date();
        let daysUntilMonday = (1 - dateWeek.getDay() + 7) % 7;
        const mondayOfThisWeek = new Date(dateWeek);
        mondayOfThisWeek.setDate(dateWeek.getDate() - daysUntilMonday);
        mondayOfThisWeek.setHours(0, 0, 0, 0);
        //console.log(mondayOfThisWeek);

        const dateMonth = new Date();
        const firstDayOfMonth = new Date(dateMonth);
        firstDayOfMonth.setDate(1);
        firstDayOfMonth.setHours(0, 0, 0, 0);
        //console.log(firstDayOfMonth);

        const day = await PostMessage.find({ $and: [{ createdAt: { $gte: dateDay } }, { creator: id }, { $or: [{ destinatari: { $ne: [] } }, { privacy: 'public' }] }] });

        //console.log(day.length);
        const week = await PostMessage.find({ $and: [{ createdAt: { $gte: mondayOfThisWeek } }, { creator: id }, { $or: [{ destinatari: { $ne: [] } }, { privacy: 'public' }] }] });
        //console.log(week.length);
        const month = await PostMessage.find({ $and: [{ createdAt: { $gte: firstDayOfMonth } }, { creator: id }, { $or: [{ destinatari: { $ne: [] } }, { privacy: 'public' }] }] });
        //console.log(month.length);

        let sumDay = 0;
        day.map((post) => {
            if (post.type === 'text') {
                sumDay += post.message.length;
            } else {
                sumDay += 125;
            }

        });

        let sumWeek = 0;
        week.map((post) => {
            if (post.type === 'text') {
                sumWeek += post.message.length;
            } else {
                sumWeek += 125;
            }
        });

        let sumMonth = 0;
        month.map((post) => {

            if (post.type === 'text') {
                sumMonth += post.message.length;
            } else {
                sumMonth += 125;
            }
        });
        //console.log(sum);

        const iniziale = await QuotaSchema.findOne({ user: id });
        //console.log(iniziale);

        const resp = {
            day: iniziale.day - sumDay + iniziale.extraDay,
            week: iniziale.week - sumWeek + iniziale.extraWeek,
            month: iniziale.month - sumMonth + iniziale.extraMonth,
            dayTot: iniziale.day + iniziale.extraDay,
            weekTot: iniziale.week + iniziale.extraWeek,
            monthTot: iniziale.month + iniziale.extraMonth
        };
        //console.log(resp);

        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json({ message: "Couldn't count charachters left" });
        console.log(error);
    }
}

export const getInitialQuota = async (req, res) => {
    try {
        const initialQuota = await InitialQuotaSchema.findOne();
        res.status(200).json(initialQuota);
    } catch (error) {
        console.log(error);
    }
};

export const setInitialQuota = async (req, res) => {
    const { day, week, month } = req.body;
    //console.log(req.body);
    try {
        const newQuota = await InitialQuotaSchema.findOneAndUpdate({}, { day: day, week: week, month: month }, { new: true });
        res.status(200).json(newQuota);
    } catch (error) {
        console.log(error);
    }
};