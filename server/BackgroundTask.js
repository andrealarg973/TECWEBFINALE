// backgroundTasks.js
import PostMessage from './models/postMessage.js';
import PostMessageTemporal from './models/postMessageTemporal.js';
import QuotaSchema from './models/quota.js';

async function doSomething(arg) {
    const dateDay = new Date();
    dateDay.setHours(17, 0, 0, 0);
    let db = arg;

    /*
    const day = await PostMessage.find({ createdAt: { $gte: dateDay } });
    //console.log(day);
    day.map((post) => {
        if (post.likes.length > (0.25 * post.visual) && post.dislikes.length > (0.25 * post.visual)) {
            console.log("CONTROVERSO: ", post._id);
        } else {
            if (post.likes.length > (0.25 * post.visual)) {
                console.log("POPOLARE: ", post._id);
            }
            else if (post.dislikes.length > (0.25 * post.visual)) {
                console.log("IMPOPOLARE: ", post._id);
            }
        }

    });
    console.log("-------------------------------------------");
    */


    //db.push('wewe');
    //console.log(arg);
    //const posts = await PostMessage.find();
    // Your periodic action code here
    //console.log("Background task executed");
    return db;
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

async function automaticPosts() {
    //console.log("ciao");

    const temporals = await PostMessageTemporal.find({ active: true });
    if (temporals.length > 0) {
        const timeNow = new Date();
        temporals.map(async (post) => {
            const millisecondsDiff = timeNow - post.createdAt;
            const secondsDiff = millisecondsDiff / 1000;
            //console.log(millisecondsDiff, " seconds");
            //console.log("manca", secondsDiff - post.repeat);
            if (secondsDiff - post.repeat > 0) {
                const newPost = new PostMessage({ createdAt: new Date().toISOString(), title: post.title, message: post.message, name: post.name, creator: post.creator, tags: post.tags, selectedFile: post.selectedFile, privacy: post.privacy, visual: post.visual, likes: post.likes, comments: post.comments, dislikes: post.islikes, comments: post.comments, destinatari: post.destinatari, destinatariPrivati: post.destinatariPrivati });
                newPost.message = replacePlaceholders(newPost.message);

                //console.log('postMessage', post);
                try {
                    await newPost.save();
                    const newTemporal = await PostMessageTemporal.findByIdAndUpdate(String(post._id), { createdAt: timeNow, title: post.title, message: post.message, name: post.name, creator: post.creator, tags: post.tags, selectedFile: post.selectedFile, privacy: post.privacy, visual: post.visual, likes: post.likes, comments: post.comments, dislikes: post.islikes, comments: post.comments, destinatari: post.destinatari, destinatariPrivati: post.destinatariPrivati }, { new: true });
                    //console.log("before:", post.createdAt);
                    //console.log("saved!", newTemporal.createdAt);
                } catch (error) {
                    console.log(error);
                }

                //console.log(post);
            }

        });
    }
    //console.log(temporals);
}

let values = ['ciao', 'ciao2'];

const delay = 100; // time in seconds
// Call the doSomething function every 5 seconds (5000 milliseconds)
//setInterval(() => { values = doSomething(values) }, delay * 1000);
setInterval(automaticPosts, delay * 1000);