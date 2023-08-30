// backgroundTasks.js
import PostMessage from './models/postMessage.js';
import PostMessageTemporal from './models/postMessageTemporal.js';
import QuotaSchema from './models/quota.js';

async function updateQuotas() {
    //const dateDay = new Date();
    //dateDay.setHours(17, 0, 0, 0);
    //let db = arg;


    const posts = await PostMessage.find();
    //console.log(day);
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



    //db.push('wewe');
    //console.log(arg);
    //const posts = await PostMessage.find();
    // Your periodic action code here
    //console.log("Background task executed");
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

    const apiUrl = 'https://api.quotable.io/random';

    return fetch(apiUrl)
        .then(response => response.json())
        .then(postInfo => {
            const data = postInfo.content;

            const replacedString = inputString
                .replace(/{DATE}/g, currentDate.toLocaleDateString(undefined, dateOptions))
                .replace(/{TIME}/g, currentDate.toLocaleTimeString(undefined, timeOptions))
                .replace(/{QUOTE}/g, data);

            return replacedString;
        });
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
                const newPost = new PostMessage({ createdAt: new Date().toISOString(), title: post.title, type: post.type, location: post.location, message: post.message, name: post.name, creator: post.creator, tags: post.tags, selectedFile: post.selectedFile, privacy: post.privacy, visual: post.visual, likes: post.likes, comments: post.comments, dislikes: post.islikes, comments: post.comments, destinatari: post.destinatari, destinatariPrivati: post.destinatariPrivati });
                //newPost.message = replacePlaceholders(newPost.message);

                const apiUrl = `http://localhost:5000/users/${newPost.creator}/getQuotas`;
                fetch(apiUrl)
                    .then(response => {
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
                                        await newPost.save();
                                        const newTemporal = await PostMessageTemporal.findByIdAndUpdate(String(post._id), { createdAt: timeNow, title: post.title, location: post.location, type: post.type, message: post.message, name: post.name, creator: post.creator, tags: post.tags, selectedFile: post.selectedFile, privacy: post.privacy, visual: post.visual, likes: post.likes, comments: post.comments, dislikes: post.islikes, comments: post.comments, destinatari: post.destinatari, destinatariPrivati: post.destinatariPrivati }, { new: true });
                                        //console.log("before:", post.createdAt);
                                        //console.log("saved!", newTemporal.createdAt);
                                    } catch (error) {
                                        console.log(error);
                                    }
                                } else {
                                    try {
                                        //await newPost.save();
                                        const newTemporal = await PostMessageTemporal.findByIdAndUpdate(String(post._id), { createdAt: timeNow, active: false, title: post.title, location: post.location, type: post.type, message: post.message, name: post.name, creator: post.creator, tags: post.tags, selectedFile: post.selectedFile, privacy: post.privacy, visual: post.visual, likes: post.likes, comments: post.comments, dislikes: post.islikes, comments: post.comments, destinatari: post.destinatari, destinatariPrivati: post.destinatariPrivati }, { new: true });
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

const delay = 3; // time in seconds
// Call the doSomething function every 5 seconds (5000 milliseconds)
//setInterval(() => { values = doSomething(values) }, delay * 1000);
setInterval(automaticPosts, delay * 1000);
//setInterval(updateQuotas, delay * 1000);