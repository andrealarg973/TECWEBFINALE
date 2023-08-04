import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';

import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';
import { updateQuota, getCar } from '../../actions/auth';
import { useNavigate } from 'react-router-dom';

// get the current id of the post

const Form = ({ currentId, setCurrentId }) => {
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: '',
        selectedFile: ''
    });
    const post = useSelector((state) => (currentId ? state.posts.posts.find((p) => p._id === currentId) : null));
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();
    const [caratteri, setCaratteri] = useState(0);
    const [initialCar, setInitialCar] = useState(0);
    const DAILY = 100;

    const getChars = async () => {
        if (user) {
            return await dispatch(getCar({ user: user?.result?._id }));

        }
        return null;
    }

    useEffect(() => {
        //console.log('ID', user?.result?._id);
        getChars().then((res) => {
            setInitialCar(res?.quota);
            //console.log('res', res);
        });

        if (post) {
            setPostData(post);
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentId === 0 || currentId === null) {
            if (initialCar - caratteri > 0) {
                dispatch(createPost({ ...postData, name: user?.result?.name }));
                dispatch(updateQuota({ ...caratteri, user: user.result._id, quota: initialCar - caratteri }));
                navigate('/');
            } else {
                alert('Quota insufficiente');
            }
        } else {

            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
        }

        clear();

    }

    const handleMessage = (e) => {
        setPostData({ ...postData, message: e.target.value });
        setCaratteri(e.target.value.length);
    }

    const clear = () => {
        setCurrentId(null);
        setPostData({ title: '', message: '', tags: '', selectedFile: '' });
    }

    if (!user?.result?.name) {
        return (
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    Please Sign In to create your post
                </Typography>
            </Paper>
        )
    }

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{currentId ? 'Edit Post' : 'Create Post'}</Typography>
                <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
                <Typography variant="h6" style={(initialCar - caratteri < 0) ? { color: 'red' } : { color: 'black' }}> Caratteri restanti: {initialCar - caratteri}</Typography>
                <TextField name="message" variant="outlined" label="Message" fullWidth multiline minRows={4} value={postData.message} onChange={handleMessage} />
                <TextField name="tags" variant="outlined" label="Tags (coma separated)" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />
                <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper >
    );
};

export default Form;