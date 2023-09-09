import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import channelRoutes from './routes/channels.js';
import multer from 'multer';
import fs from 'fs';
import './BackgroundTask.js';
import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/', express.static(path.join(__dirname, 'react-app/build')));

// Serve the Vue app
app.use('/', express.static(path.join(__dirname, 'vue-app/dist')));
function isAPI(url) {
    return url.startsWith(`/api`);
}
function isReact(url) {
    return url.startsWith(`/react`);
}
function isVue(url) {
    return url.startsWith(`/vue`);
}

app.get('*', (req, res, next) => {
    //res.status(404).send('senti tu coso , non e\' che posso avere tutto eh! insomma un po\' di comprensione uffa!');
    //(__dirname + '/static/dist')
    if (isAPI(req.url)) return next();
    if (isReact(req.url)) {
        return res.sendFile('index.html', { 'root': __dirname + '/react-app/build' });
    }
    if (isVue(req.url)) {
        return res.sendFile('index.html', { 'root': __dirname + '/vue-app/dist' });
    }
});


app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/channels', channelRoutes);
//app.use('/public/media', express.static(__dirname + '/public/media'));
app.use('/api/public/media', express.static(path.join(__dirname, '/public/media')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, "./public/media");
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.split(".").pop();
        return cb(null, `${Date.now()}_${req.params.id}.${extension}`);
    }
});

const upload = multer({ storage });

app.post('/:id/uploadMedia', upload.single('file'), (req, res) => {
    res.status(200).json(req.file);
});




//const CONNECTION_URL = 'mongodb+srv://user:user@cluster0.xmu1sog.mongodb.net/?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log('Server running on port: ' + PORT)))
    .catch((err) => console.log(err.message));

//mongoose.set('useFindAndModify', false);