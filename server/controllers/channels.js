import express from 'express';
import mongoose from 'mongoose';

import ChannelSchema from '../models/channel.js';

const router = express.Router();

export const getChannels = async (req, res) => {
    try {
        const channels = await ChannelSchema.find();
        //console.log(channels);

        res.status(200).json(channels);
    } catch (error) {
        console.log(error);
    }
}

export default router;