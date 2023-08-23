import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';
import PostMessageTemporal from '../models/postMessageTemporal.js';
import ChannelSchema from '../models/channel.js';

const router = express.Router();

export const getPosts = async (req, res) => {
    const { page } = req.query;
    const id = req.params.id;
    //console.log(id);

    try {
        const LIMIT = 12;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        //const total = await PostMessage.countDocuments({});

        // ottiene tutti i canali per i quali l'utente può visualizzare/postare messaggi (e che non siano chiusi)
        const canali = await ChannelSchema.find({ $and: [{ $or: [{ owner: { $in: id } }, { participants: { $in: id } }, { privacy: 'public' }] }, { privacy: { $ne: 'closed' } }] });
        //console.log(canali);

        // ottiene tutti i post visualizzabili dall'utente in questione
        const posts = await PostMessage.find({ $or: [{ creator: id }, { destinatariPrivati: { $in: id } }, { destinatari: { $in: canali.map((canale) => canale.value) } }] }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        const total = await PostMessage.find({ $or: [{ creator: id }, { destinatariPrivati: { $in: id } }, { destinatari: { $in: canali.map((canale) => canale.value) } }] }).sort({ _id: -1 }).countDocuments({});
        //console.log(total);

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// QUERY -> /posts?page=1 -> page = 1
// PARAMS -> /posts/123 -> id = 123
export const getPostsBySearch = async (req, res) => {
    //console.log('SEARCH');
    const { searchQuery, tags, channel } = req.query;
    //console.log(tags);

    try {
        const title = new RegExp(searchQuery, 'i'); // test Test TEST TEsT
        const message = new RegExp(searchQuery, 'i');
        //console.log(channel);


        if (tags !== '') {
            //console.log('tag not empty', tags);
            const posts = await PostMessage.find({ $or: [{ title }, { message }, { destinatari: { $in: channel } }, { tags: { $in: tags.split(',') } }] }).sort({ _id: -1 }); // find post based on two criteria: title or tags
            res.json({ data: posts });
        } else {
            const posts = await PostMessage.find({ $or: [{ title }, { message }, { destinatari: { $in: channel } }] }).sort({ _id: -1 }); // find post based on two criteria: title or tags
            //console.log(posts);
            res.json({ data: posts });
        }

        //console.log(posts);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsByUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const posts = await PostMessage.find({ creator: userId }).sort({ _id: -1 });
        res.status(200).json({ data: posts });
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getPostsByChannel = async (req, res) => {
    const channel = req.params.value;

    try {
        const posts = await PostMessage.find({ destinatari: { $in: channel } }).sort({ _id: -1 });
        res.status(200).json({ data: posts });
    } catch (error) {
        res.status(500).json(error);
    }
}

function replacePlaceholders(inputString) {
    const currentDate = new Date();

    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const timeOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    const replacedString = inputString
        .replace(/{DATE}/g, currentDate.toLocaleDateString(undefined, dateOptions))
        .replace(/{TIME}/g, currentDate.toLocaleTimeString(undefined, timeOptions));

    return replacedString;
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

    newPostMessage.message = replacePlaceholders(newPostMessage.message);

    //console.log(newPostMessage);

    try {
        await newPostMessage.save();
        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const createAutomaticPost = async (req, res) => {
    const post = req.body;
    const newPostMessageTemporal = new PostMessageTemporal({ ...post, creator: req.userId, createdAt: new Date().toISOString() });


    //console.log(newPostMessageTemporal);

    try {
        await newPostMessageTemporal.save();
        res.status(201).json(newPostMessageTemporal);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags, likes, destinatari, destinatariPrivati, privacy } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, likes, destinatari, destinatariPrivati, privacy, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const updateVisual = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { visual: post.visual + 1 }, { new: true });

    res.json(updatedPost);

}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: 'Post deleted succesfully!' });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));
    const index1 = post.dislikes.findIndex((id) => id === String(req.userId));

    if (index1 !== -1) {
        post.dislikes = post.dislikes.filter((id) => id !== String(req.userId));
    }

    if (index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
}

export const dislikePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const index = post.dislikes.findIndex((id) => id === String(req.userId));
    const index1 = post.likes.findIndex((id) => id === String(req.userId));

    if (index1 !== -1) {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    if (index === -1) {
        post.dislikes.push(req.userId);
    } else {
        post.dislikes = post.dislikes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);

}

export default router;