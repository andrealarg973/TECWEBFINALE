import express from 'express';
import mongoose from 'mongoose';

import User from '../models/user.js';
import ChannelSchema from '../models/channel.js';

const router = express.Router();

export const getOwnedChannels = async (req, res) => {
    let id = req.params.id;
    //console.log('BODY', id);
    let vip = await User.findById(id);

    if (vip.role === 'smm') {
        const smm = await User.find({ smm: id });
        //console.log(smm);
        if (smm.length > 0) {
            id = String(smm[0]._id);
            vip = await User.findById(id);
        }
    }
    try {
        const channels = await ChannelSchema.find({ owner: { $in: id } });
        //console.log(channels);

        res.status(200).json(channels);
    } catch (error) {
        console.log(error);
    }
}
export const getWritableChannels = async (req, res) => {
    let id = req.params.id;
    //console.log('BODY', id);
    let vip = await User.findById(id);

    if (vip.role === 'smm') {
        const smm = await User.find({ smm: id });
        //console.log(smm);
        if (smm.length > 0) {
            id = String(smm[0]._id);
            vip = await User.findById(id);
        }
    }
    try {
        const channels = await ChannelSchema.find({ $and: [{ $or: [{ owner: { $in: id } }, { write: { $in: id } }] }, { privacy: { $ne: 'closed' } }] });
        //console.log(channels);

        res.status(200).json(channels);
    } catch (error) {
        console.log(error);
    }
}
export const getReadableChannels = async (req, res) => {
    const id = req.params.id;
    //console.log('BODY', id);
    try {
        const channels = await ChannelSchema.find({ $or: [{ owner: { $in: id } }, { write: { $in: id } }, { read: { $in: id } }, { privacy: 'reserved' }] });
        //console.log(channels);

        res.status(200).json(channels);
    } catch (error) {
        console.log(error);
    }
}

export const getPublicChannels = async (req, res) => {
    const id = req.params.id;
    //console.log('BODY', id);
    try {
        const channels = await ChannelSchema.find({ $and: [{ $or: [{ privacy: 'public' }, { privacy: 'reserved' }, { write: { $in: id } }, { read: { $in: id } }] }, { privacy: { $ne: 'closed' } }, { owner: { $not: { $in: id } } }] });
        //console.log(channels);

        res.status(200).json(channels);
    } catch (error) {
        console.log(error);
    }
}

export const getChannelByName = async (req, res) => {
    const name = req.params.id;
    //console.log('BODY', id);
    try {
        const channel = await ChannelSchema.findOne({ value: name });
        //console.log(channel);

        res.status(200).json(channel);
    } catch (error) {
        console.log(error);
    }
}

export const getChannels = async (req, res) => {
    const id = req.params.id;
    //console.log('BODY', id);
    try {
        const channels = await ChannelSchema.find();
        //console.log(channels);

        res.status(200).json(channels);
    } catch (error) {
        console.log(error);
    }
}

export const getReservedChannels = async (req, res) => {
    const id = req.params.id;
    //console.log('BODY', id);
    try {
        const channels = await ChannelSchema.find({ privacy: 'reserved' });
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
        const channels = await ChannelSchema.find({ owner: { $in: id } });
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

export const updateChannel = async (req, res) => {
    const id = req.params.id;
    const channel = req.body;

    try {
        const updatedChannel = await ChannelSchema.findByIdAndUpdate(id, channel, { new: true });
        //console.log(updatedChannel);
        res.status(201).json(updatedChannel);
    } catch (error) {
        console.log(error);
    }
}

export default router;