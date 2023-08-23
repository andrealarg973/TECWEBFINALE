// backgroundTasks.js
import PostMessage from './models/postMessage.js';
import PostMessageTemporal from './models/postMessageTemporal.js';

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

async function automaticPosts() {
    //console.log("ciao");

    const temporals = await PostMessageTemporal.find({ active: true });
    //console.log(temporals);
}

let values = ['ciao', 'ciao2'];

const delay = 1; // time in seconds
// Call the doSomething function every 5 seconds (5000 milliseconds)
//setInterval(() => { values = doSomething(values) }, delay * 1000);
setInterval(automaticPosts, delay * 1000);