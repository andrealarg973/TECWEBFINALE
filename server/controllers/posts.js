import express from 'express';
import mongoose from 'mongoose';

import User from '../models/user.js';
import PostMessage from '../models/postMessage.js';
import PostMessageTemporal from '../models/postMessageTemporal.js';
import ChannelSchema from '../models/channel.js';
import NotificationlSchema from '../models/notification.js';

const router = express.Router();

export const getPosts = async (req, res) => {
    const { page } = req.query;
    let id = req?.params?.id;
    //console.log(id);

    // get vip's posts and smm
    let vip = await User.findById(id);
    let smm = [];

    if (vip.role === 'smm') {
        smm = await User.find({ smm: id });
        //console.log(smm);
        if (smm.length > 0) {
            id = String(smm[0]._id);
            vip = await User.findById(id);
        }
    }
    //console.log(id);

    try {
        const LIMIT = 12;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        //const total = await PostMessage.countDocuments({});

        // ottiene tutti i canali per i quali l'utente può visualizzare/postare messaggi (e che non siano chiusi)
        const canali = await ChannelSchema.find({ $or: [{ owner: { $in: id } }, { write: { $in: id } }, { read: { $in: id } }, { privacy: 'reserved' }] });
        //console.log(canali);

        // ottiene tutti i post visualizzabili dall'utente in questione
        const posts = await PostMessage.find({ $or: [{ $or: [{ creator: ((vip.role === 'smm' && smm.length < 1) ? 'notfound' : id) }, { name: vip.name }] }, { destinatariPrivati: { $in: id } }, { privacy: 'public' }, { destinatari: { $in: canali.map((canale) => canale.value) } }] }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        const total = await PostMessage.find({ $or: [{ $or: [{ creator: ((vip.role === 'smm' && smm.length < 1) ? 'notfound' : id) }, { name: vip.name }] }, { destinatariPrivati: { $in: id } }, { privacy: 'public' }, { destinatari: { $in: canali.map((canale) => canale.value) } }] }).sort({ _id: -1 }).countDocuments({});
        //console.log(total);

        const replyPostsId = posts.filter(post => post.reply !== '').map(post => post.reply);

        const replyPosts = await PostMessage.find({ _id: { $in: replyPostsId } });
        //console.log(replyPosts);

        res.status(200).json({ data: posts, replyPosts: replyPosts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getChannelPosts = async (req, res) => {
    const id = req.params.id;
    //console.log(id);

    try {
        const posts = await PostMessage.find({ destinatari: { $in: id } }).sort({ _id: -1 });
        if (id === 'TRENDING') {
            posts.sort((a, b) => b.likes.length - a.likes.length);
        }
        const replyPostsId = posts.filter(post => post.reply !== '').map(post => post.reply);

        const replyPosts = await PostMessage.find({ _id: { $in: replyPostsId } });
        //console.log(posts);
        res.status(200).json({ data: posts, replyPosts: replyPosts });
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getUnloggedPosts = async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 12;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        //const total = await PostMessage.countDocuments({});

        const canali = await ChannelSchema.find({ privacy: 'reserved' });
        const posts = await PostMessage.find({ destinatari: { $in: canali.map((canale) => canale.value) } }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        const total = await PostMessage.find({ destinatari: { $in: canali.map((canale) => canale.value) } }).countDocuments({});
        const replyPostsId = posts.filter(post => post.reply !== '').map(post => post.reply);
        const replyPosts = await PostMessage.find({ _id: { $in: replyPostsId } });

        //console.log({ data: posts, replyPosts: replyPosts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) })

        res.status(200).json({ data: posts, replyPosts: replyPosts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getTemporalPosts = async (req, res) => {
    let id = req.params.id;
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
        // ottiene tutti i canali per i quali l'utente può visualizzare/postare messaggi (e che non siano chiusi)
        const temporalPosts = await PostMessageTemporal.find({ $or: [{ creator: id }, { name: vip.name }] });
        //console.log(temporalPosts);
        const replyPostsId = temporalPosts.filter(post => post.reply !== '').map(post => post.reply);

        const replyPosts = await PostMessage.find({ _id: { $in: replyPostsId } });
        //console.log(replyPosts);

        res.status(200).json({ data: temporalPosts, replyPosts: replyPosts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        if (post.reply !== '') {
            const replyPost = await PostMessage.findById(post.reply);
            return res.status(200).json({ data: post, replyPost: replyPost });
        }

        res.status(200).json({ data: post });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getReplyPost = async (req, res) => {
    const { id } = req.body;

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

    try {
        const title = new RegExp(searchQuery, 'i'); // test Test TEST TEsT
        const message = new RegExp(searchQuery, 'i');
        //console.log(channel);


        if (tags !== '') {
            //console.log('tag not empty', tags);
            const myTags = tags.split(',');
            const trimmedTags = myTags.map(tag => tag.trim());  // rimuove gli spazi tra i tag
            //console.log(trimmedTags);
            //const posts = await PostMessage.find({ $or: [{ title }, { message }, { destinatari: { $in: channel } }, { tags: { $in: trimmedTags } }] }).sort({ _id: -1 }); // find post based on two criteria: title or tags
            const posts = await PostMessage.find({
                $or: [
                    { title },
                    { message },
                    { destinatari: { $in: channel } },
                    { tags: { $in: trimmedTags } }
                ],
                destinatariPrivati: { $size: 0 } // Check if destinatariPrivati array length is 0 (no des privati in ricerca)
            }).sort({ _id: -1 });

            const replyPostsId = posts.filter(post => post.reply !== '').map(post => post.reply);

            const replyPosts = await PostMessage.find({ _id: { $in: replyPostsId } });
            res.json({ data: posts, replyPosts: replyPosts });
        } else {
            //const posts = await PostMessage.find({ $or: [{ title }, { message }, { destinatari: { $in: channel } }] }).sort({ _id: -1 }); // find post based on two criteria: title or tags
            const posts = await PostMessage.find({
                $or: [
                    { title },
                    { message },
                    { destinatari: { $in: channel } }
                ],
                destinatariPrivati: { $size: 0 } // Check if destinatariPrivati array length is 0
            }).sort({ _id: -1 });

            //console.log(posts);
            const replyPostsId = posts.filter(post => post.reply !== '').map(post => post.reply);

            const replyPosts = await PostMessage.find({ _id: { $in: replyPostsId } });
            res.json({ data: posts, replyPosts: replyPosts });
        }

        //console.log(posts);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsByUser = async (req, res) => {
    let userId = req.params.id;

    try {
        // FIX THIS
        //console.log(userId);
        let vip = await User.findById(userId);
        //let vip = await User.findById(id);
        let smm = [];

        if (vip.role === 'smm') {
            smm = await User.find({ smm: userId });
            //console.log(smm);
            if (smm.length > 0) {
                userId = String(smm[0]._id);
                vip = await User.findById(userId);
            }
        }
        const posts = await PostMessage.find({ $or: [{ creator: ((vip.role === 'smm' && smm.length < 1) ? 'notfound' : userId) }, { name: vip.name }] }).sort({ _id: -1 });
        //console.log(posts);

        //const posts = await PostMessage.find({ creator: userId }).sort({ _id: -1 });
        const replyPostsId = posts.filter(post => post.reply !== '').map(post => post.reply);

        const replyPosts = await PostMessage.find({ _id: { $in: replyPostsId } });
        res.status(200).json({ data: posts, replyPosts: replyPosts });
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

async function fetchDataAndReplace(inputString) {
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

    const quoteUrl = 'https://api.quotable.io/random';
    const newsUrl = 'https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=ff7e09cfb7464b1c974afc87efe0ee54';

    if (inputString.includes('{QUOTE}')) {
        return fetch(quoteUrl)
            .then(response => response.json())
            .then(postInfo => {
                const data = postInfo.content;

                const replacedString = inputString
                    .replace(/{DATE}/g, currentDate.toLocaleDateString(undefined, dateOptions))
                    .replace(/{TIME}/g, currentDate.toLocaleTimeString(undefined, timeOptions))
                    .replace(/{QUOTE}/g, data);

                return replacedString;
            });
    } else if (inputString.includes('{NEWS}')) {
        //console.log('NEWS');
        return fetch(newsUrl)
            .then(response => response.json())
            .then(postInfo => {
                const num = postInfo.totalResults;
                //console.log(postInfo.articles);
                const article = postInfo.articles[Math.floor(Math.random() * num)];
                const msg = "From " + article.author + ": " + article.title + "\n" + article.description + "...\n" + "Continue reading at: " + article.url;
                //console.log(msg);

                const replacedString = inputString
                    .replace(/{DATE}/g, currentDate.toLocaleDateString(undefined, dateOptions))
                    .replace(/{TIME}/g, currentDate.toLocaleTimeString(undefined, timeOptions))
                    .replace(/{NEWS}/g, msg);

                return replacedString;
            });
    } else {
        const replacedString = inputString
            .replace(/{DATE}/g, currentDate.toLocaleDateString(undefined, dateOptions))
            .replace(/{TIME}/g, currentDate.toLocaleTimeString(undefined, timeOptions));

        return replacedString;
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    //console.log(post);
    const vip = await User.find({ smm: req.userId });
    //console.log(vip[0].name);
    //console.log(post.name);
    const newPostMessage = new PostMessage({ ...post, location: (post.type === 'location' ? post.location : []), creator: req.userId, name: (vip.length > 0 ? vip[0].name : post.name), createdAt: new Date().toISOString() });

    fetchDataAndReplace(newPostMessage.message)
        .then(async (replacedString) => {
            //console.log("VAL: ", replacedString);
            newPostMessage.message = replacedString;



            if (newPostMessage.reply !== '') {
                const dest = await PostMessage.findById(newPostMessage.reply);

                if (dest.creator !== newPostMessage.creator) {
                    const msg = ' replied at your post.';
                    const newNotify = NotificationlSchema({ postId: newPostMessage._id, userId: dest.creator, createdAt: newPostMessage.createdAt, content: msg, sender: '@' + newPostMessage.name });
                    newNotify.save();
                }
                let vip = await User.find({ smm: dest.creator }); // redirect notifications to real user

                if (dest.creator !== newPostMessage.creator && vip.length > 0) {
                    const msg = ' replied at your post.';
                    const newNotify = NotificationlSchema({ postId: newPostMessage._id, userId: vip[0]._id, createdAt: newPostMessage.createdAt, content: msg, sender: '@' + newPostMessage.name });
                    newNotify.save();
                }
                //console.log(newNotify);
            } else {
                if (newPostMessage.destinatariPrivati.length > 0 && newPostMessage.reply === '') {
                    newPostMessage.destinatariPrivati.map(dest => {
                        if (dest != req.userId) {
                            const msg = ' tagged you on a post.';
                            const newNotify = NotificationlSchema({ postId: newPostMessage._id, userId: dest, createdAt: newPostMessage.createdAt, content: msg, sender: '@' + newPostMessage.name });
                            newNotify.save();
                        }
                    });
                }
            }

            try {
                newPostMessage.save();
                //console.log("msg: ", newPostMessage);
                res.status(201).json(newPostMessage);
            } catch (error) {
                res.status(409).json({ message: error.message });
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
    //newPostMessage.message = await replacePlaceholders(newPostMessage.message);

    //console.log(newPostMessage);


}

export const createAutomaticPost = async (req, res) => {
    const post = req.body;
    const vip = await User.find({ smm: req.userId });
    //console.log(vip[0].name);
    //console.log(post.name);

    const newPostMessageTemporal = new PostMessageTemporal({ ...post, creator: req.userId, name: (vip.length > 0 ? vip[0].name : post.name), createdAt: new Date().toISOString() });


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

export const updateTemporal = async (req, res) => {
    const { id } = req.params;
    const updatedPost = req.body;
    //console.log(updatedPost);
    //console.log(id);
    let vip = await User.findById(updatedPost.creator);
    let theName = vip.name;
    //console.log(vip.name);

    if (vip.role === 'smm') {
        const smm = await User.find({ smm: updatedPost.creator });
        //console.log(smm);
        if (smm.length > 0) {
            //id = String(smm[0]._id);
            theName = smm[0].name;
            //vip = await User.findById(id);
        }
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    //const updatedPost = { creator, title, message, tags, likes, destinatari, destinatariPrivati, privacy, selectedFile, _id: id };

    const newUpdatedPost = await PostMessageTemporal.findByIdAndUpdate(id, updatedPost, { creator: vip._id }, { name: theName }, { new: true });
    //console.log(updatedPost);
    res.json(newUpdatedPost);
}

export const updateVisual = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { visual: post.visual + 1 }, { new: true });
    //console.log(updatedPost.visual);

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