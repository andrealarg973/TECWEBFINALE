// backgroundTasks.js
import User from './models/user.js';
import PostMessage from './models/postMessage.js';
import PostMessageTemporal from './models/postMessageTemporal.js';
import QuotaSchema from './models/quota.js';
import NotificationlSchema from './models/notification.js';
import StatisticSchema from './models/statistic.js';

async function getControversial() {
    //const dateDay = new Date();
    //dateDay.setHours(17, 0, 0, 0);
    //let db = arg;

    /*
    const posts = await PostMessage.find();

    posts.map((post) => {
        if (post.likes.length > (0.25 * post.visual) && post.dislikes.length > (0.25 * post.visual)) {
            console.log("CONTROVERSO: ", post.message, post.likes.length, post.dislikes.length, post.visual);
        } else {
            if (post.likes.length > (0.25 * post.visual)) {
                console.log("POPOLARE: ", post.message, post.likes.length, post.visual);
            }
            else if (post.dislikes.length > (0.25 * post.visual)) {
                console.log("IMPOPOLARE: ", post.message, post.dislikes.length, post.visual);
            }
        }

    });
    console.log("-------------------------------------------");
    */

    const postsToMoveInControversial = await PostMessage.aggregate([
        {
            $match: {
                $expr: {
                    $and: [
                        { $lt: [{ $size: "$destinatariPrivati" }, 1] },
                        { $gt: [{ $size: "$likes" }, { $multiply: ["$visual", 0.25] }] },
                        { $gt: [{ $size: "$dislikes" }, { $multiply: ["$visual", 0.25] }] },
                        { $not: { $in: ["CONTROVERSIAL", "$destinatari"] } }
                    ]
                }
            }
        }
    ]);

    const postsToRemoveFromControversial = await PostMessage.aggregate([
        {
            $match: {
                $expr: {
                    $and: [
                        {
                            $or: [
                                { $lte: [{ $size: "$likes" }, { $multiply: ["$visual", 0.25] }] },
                                { $lte: [{ $size: "$dislikes" }, { $multiply: ["$visual", 0.25] }] }
                            ]
                        },
                        { $in: ["CONTROVERSIAL", "$destinatari"] }
                    ]
                }
            }
        }
    ]);

    // need to check that post is not private!!

    //console.log('add', postsToMoveInControversial);
    //console.log('remove', postsToRemoveFromControversial);


    postsToMoveInControversial.map(async (post) => {
        await PostMessage.findByIdAndUpdate(post._id, { destinatari: post.destinatari.concat(['CONTROVERSIAL']) }, { new: true });
    });

    postsToRemoveFromControversial.map(async (post) => {
        await PostMessage.findByIdAndUpdate(post._id, { destinatari: post.destinatari.filter((dest) => dest !== 'CONTROVERSIAL') }, { new: true });
    });


}

async function updateQuotas() {
    const currentStats = await PostMessage.aggregate([
        {
            $match: {
                'destinatariPrivati': { $exists: true }, // Ensure the field exists
                $expr: { $lte: [{ $size: '$destinatariPrivati' }, 0] } // Check the length of the array
            }
        },
        {
            $group: {
                _id: "$creator",
                popularPosts: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $gt: [{ $size: "$likes" }, { $multiply: ["$visual", 0.25] }] },
                                    { $lte: [{ $size: "$dislikes" }, { $multiply: ["$visual", 0.25] }] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },
                impopularPosts: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $lte: [{ $size: "$likes" }, { $multiply: ["$visual", 0.25] }] },
                                    { $gt: [{ $size: "$dislikes" }, { $multiply: ["$visual", 0.25] }] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },
                controversialPosts: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $gt: [{ $size: "$likes" }, { $multiply: ["$visual", 0.25] }] },
                                    { $gt: [{ $size: "$dislikes" }, { $multiply: ["$visual", 0.25] }] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                popularPosts: 1,
                impopularPosts: 1,
                controversialPosts: 1,
                totalPosts: {
                    $add: ["$popularPosts", "$impopularPosts", "$controversialPosts"]
                }
            }
        }
    ]);

    const previousStats = await StatisticSchema.find();
    //console.log(previousStatistics);

    currentStats.map(async (currStat) => {
        const previousStat = previousStats.find(s => s.userId === currStat._id);
        if (currStat.popularPosts > previousStat.maxPopularPosts) {
            //console.log(currStat._id + " new popular quote: " + currStat.popularPosts + " vs previous " + previousStat.maxPopularPosts);
            await StatisticSchema.findByIdAndUpdate(previousStat._id, { maxPopularPosts: currStat.popularPosts }, { new: true });
            if (parseInt(currStat.popularPosts / 10) > parseInt(previousStat.maxPopularPosts / 10)) {
                //console.log('HAVE TO INCREASE QUOTA');
                const quota = await QuotaSchema.findOne({ user: currStat._id });
                const newQuota = await QuotaSchema.findByIdAndUpdate(
                    quota._id,
                    {
                        extraDay: quota.extraDay + (parseInt(quota.day / 100)),
                        extraWeek: quota.extraWeek + (parseInt(quota.week / 100)),
                        extraMonth: quota.extraMonth + (parseInt(quota.month / 100)),
                    },
                    { new: true }
                );
                //console.log(newQuota);
            }
        }
        if (currStat.impopularPosts > previousStat.maxImpopularPosts) {
            //console.log(currStat._id + " new impopular quote: " + currStat.impopularPosts + " vs previous " + previousStat.maxImpopularPosts);
            await StatisticSchema.findByIdAndUpdate(previousStat._id, { maxImpopularPosts: currStat.impopularPosts }, { new: true });
            if (parseInt(currStat.impopularPosts / 3) > parseInt(previousStat.maxImpopularPosts / 3)) {
                //console.log('HAVE TO REDUCE QUOTA');
                const quota = await QuotaSchema.findOne({ user: currStat._id });
                const newQuota = await QuotaSchema.findByIdAndUpdate(
                    quota._id,
                    {
                        extraDay: quota.extraDay - (parseInt(quota.day / 100)),
                        extraWeek: quota.extraWeek - (parseInt(quota.week / 100)),
                        extraMonth: quota.extraMonth - (parseInt(quota.month / 100)),
                    },
                    { new: true }
                );
                //console.log(newQuota);
            }
        }

        if (currStat.popularPosts !== previousStat.popularPosts || currStat.impopularPosts !== previousStat.impopularPosts || currStat.controversialPosts !== previousStat.controversialPosts) {
            await StatisticSchema.findByIdAndUpdate(previousStat._id, { popularPosts: currStat.popularPosts, impopularPosts: currStat.impopularPosts, controversialPosts: currStat.controversialPosts }, { new: true });
        }
    });

    //const posts = await postsAggregate.toArray();
    //console.log(currentStats);

}

async function setTrendingPosts() {
    //const posts = await PostMessage.find().sort({ likes: { $size: -1 } }).limit(10);
    const posts = await PostMessage.aggregate([
        {
            $project: {
                _id: 1,
                destinatari: 1,
                likesCount: { $size: "$likes" },
                destinatariPrivatiCount: { $size: "$destinatariPrivati" }
            }
        },
        {
            $match: {
                destinatariPrivatiCount: { $lte: 0 }
            }
        },
        {
            $sort: { likesCount: -1 }
        },
        {
            $limit: 12
        }
    ]);

    await removeTrendingPosts();

    //console.log(posts);
    posts.map(async (post) => {
        await PostMessage.findByIdAndUpdate(post._id, {
            destinatari: (
                post.destinatari.find((dest) => dest === 'TRENDING') ?
                    post.destinatari :
                    post.destinatari.concat(['TRENDING'])
            )
        }, { new: true });
    });
    //console.log('---------');
}

async function removeTrendingPosts() {
    const trendingPosts = await PostMessage.find({ destinatari: { $in: 'TRENDING' } });
    trendingPosts.map(async (post) => {
        await PostMessage.findByIdAndUpdate(post._id, { destinatari: post.destinatari.filter((dest) => dest !== 'TRENDING') }, { new: true });
    });
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

// checks if there are temporized posts to post
async function automaticPosts() {

    const temporals = await PostMessageTemporal.find({ active: true });

    if (temporals.length > 0) {
        const timeNow = new Date();
        temporals.map(async (post) => {
            const millisecondsDiff = timeNow - post.createdAt;
            const secondsDiff = millisecondsDiff / 1000;
            //console.log(millisecondsDiff, " seconds");
            //console.log("manca", secondsDiff - post.repeat);

            if (secondsDiff - post.repeat > 0) {
                const vip = await User.find({ smm: post.creator });
                const newPost = new PostMessage({ createdAt: new Date().toISOString(), title: post.title, reply: post.reply, type: post.type, location: post.location, message: post.message, name: (vip.length > 0 ? vip[0].name : post.name), creator: post.creator, tags: post.tags, selectedFile: post.selectedFile, privacy: post.privacy, visual: post.visual, likes: post.likes, comments: post.comments, dislikes: post.islikes, comments: post.comments, destinatari: post.destinatari, destinatariPrivati: post.destinatariPrivati });
                //newPost.message = replacePlaceholders(newPost.message);
                const apiUrl = `http://localhost:5000/api/users/${newPost.creator}/getQuotas`;
                fetch(apiUrl)
                    .then(response => {
                        //console.log("QUI");
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(async (usati) => {
                        // Process the data returned from the API

                        fetchDataAndReplace(newPost.message)
                            .then(async (replacedString) => {
                                //console.log("VAL: ", replacedString);
                                newPost.message = await replacedString;
                                //console.log("msg: ", newPost.message);

                                const car = Math.min(usati.month, usati.week, usati.day) - ((newPost.type === 'text') ? newPost.message.length : 125);
                                //console.log('Quota', car);
                                if (car >= 0) {
                                    try {
                                        if (newPost.destinatariPrivati.length > 0) {
                                            newPost.destinatariPrivati.map(dest => {
                                                const msg = ' tagged you on a post.';
                                                const newNotify = NotificationlSchema({ postId: newPost._id, userId: dest, createdAt: newPost.createdAt, content: msg, sender: '@' + newPost.name });
                                                newNotify.save();
                                            });
                                        }

                                        if (newPost.reply !== '') {
                                            const dest = await PostMessage.findById(newPost.reply);
                                            if (dest.creator !== newPost.creator) {
                                                const msg = ' replied at your post.';
                                                const newNotify = NotificationlSchema({ postId: newPost._id, userId: dest.creator, createdAt: newPost.createdAt, content: msg, sender: '@' + newPost.name });
                                                newNotify.save();
                                            }
                                            //console.log(newNotify);
                                        }

                                        await newPost.save();
                                        const newTemporal = await PostMessageTemporal.findByIdAndUpdate(String(post._id), { createdAt: timeNow, title: post.title, reply: post.reply, location: post.location, type: post.type, message: post.message, name: post.name, creator: post.creator, tags: post.tags, selectedFile: post.selectedFile, privacy: post.privacy, visual: post.visual, likes: post.likes, comments: post.comments, dislikes: post.islikes, comments: post.comments, destinatari: post.destinatari, destinatariPrivati: post.destinatariPrivati }, { new: true });
                                        //console.log("before:", post.createdAt);
                                        //console.log("saved!", newTemporal.createdAt);
                                    } catch (error) {
                                        console.log(error);
                                    }
                                } else {
                                    try {
                                        //await newPost.save();
                                        const newTemporal = await PostMessageTemporal.findByIdAndUpdate(String(post._id), { createdAt: timeNow, active: false, title: post.title, reply: post.reply, location: post.location, type: post.type, message: post.message, name: post.name, creator: post.creator, tags: post.tags, selectedFile: post.selectedFile, privacy: post.privacy, visual: post.visual, likes: post.likes, comments: post.comments, dislikes: post.islikes, comments: post.comments, destinatari: post.destinatari, destinatariPrivati: post.destinatariPrivati }, { new: true });
                                        //console.log("before:", post.createdAt);
                                        //console.log("saved!", newTemporal.createdAt);
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }

                            })
                            .catch(error => {
                                console.error('Error:', error);
                            });



                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                    });

                //console.log('postMessage', post);


                //console.log(post);
            }

        });
    }
    //console.log(temporals);
}

const automaticPostsDelay = 2; // time in seconds
const automaticQuotaDelay = 30; // time in seconds
const getControversialDelay = 60; // time in seconds
const removeTrendingPostsDelay = 10;
const setTrendingPostsDelay = 30;

setInterval(automaticPosts, automaticPostsDelay * 1000);
setInterval(updateQuotas, automaticQuotaDelay * 1000);
setInterval(getControversial, getControversialDelay * 1000);
setInterval(setTrendingPosts, setTrendingPostsDelay * 1000);
//setInterval(removeTrendingPosts, 1 * 1000);