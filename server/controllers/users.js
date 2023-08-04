import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import QuotaSchema from '../models/quota.js';

const router = express.Router();

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'secret', { expiresIn: "1h" });

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const signup = async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: "User already exists" });

        if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" });

        const hashedPassword = await bcrypt.hash(password, 12);

        let temp = firstName + " " + lastName;

        const result = await User.create({ email, password: hashedPassword, name: temp });

        const quota = await QuotaSchema.create({ user: result._id, quota: 100 });

        //console.log(result);

        const token = jwt.sign({ email: result.email, id: result._id }, 'secret', { expiresIn: "1h" });

        res.status(200).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!!!!" });
        console.log(error);
    }
}


export const updateQuota = async (req, res) => {
    //console.log(req.body);
    const id = req.body.user;
    const quota = req.body.quota;
    //console.log(quota);
    if (quota < 0) res.status(500).json({ message: "You exceeded your quota!!!!" });

    try {
        const message = new RegExp(id, 'i');

        const temp = await QuotaSchema.findOne({ $or: [{ user: message }] });
        console.log('USER', temp);
        temp.quota += quota;
        console.log('USER', temp);

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