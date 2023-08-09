import express from 'express';
import mongoose from 'mongoose';

import ChannelSchema from '../models/channel.js';

const router = express.Router();

export const getChannels = async (req, res) => {
    const id = req.params.id;
    //console.log('BODY', id);
    try {
        const channels = await ChannelSchema.find({ $or: [{ privacy: 'public' }, { owner: id }, { participants: { $in: id } }] });
        //console.log(channels);

        res.status(200).json(channels);
    } catch (error) {
        console.log(error);
    }
}

export const getMyChannels = async (req, res) => {
    const id = req.params.id;
    //console.log('BODY', id);
    try {
        const channels = await ChannelSchema.find({ owner: id });
        //console.log(channels);

        res.status(200).json(channels);
    } catch (error) {
        console.log(error);
    }
}

export const addChannel = async (req, res) => {
    const channel = req.body;
    //console.log(channel);
    const newChannel = new ChannelSchema({ ...channel, label: req.body.label, value: req.body.value });
    //console.log(newChannel);
    try {
        await newChannel.save();
        res.status(201).json(newChannel);
    } catch (error) {
        console.log(error);
    }
}

export default router;