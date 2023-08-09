import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import CreateSelect from 'react-select/creatable';
import Select from 'react-select';

import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';
import { getUsers, updateQuota, getCar } from '../../actions/auth';
import { getChannels, createChannel } from '../../actions/channels';
import { useNavigate } from 'react-router-dom';

// get the current id of the post

const Form = ({ currentId, setCurrentId }) => {
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: '',
        selectedFile: '',
        destinatari: [],
        destinatariPrivati: [],
    });
    const post = useSelector((state) => (currentId ? state.posts.posts.find((p) => p._id === currentId) : null));
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();
    const [caratteri, setCaratteri] = useState(0);
    const [initialCar, setInitialCar] = useState(0);
    const DAILY = 100;
    const [channels, setChannels] = useState([]);
    const [users, setUsers] = useState([]);
    const options = [
        { value: "OFFICIAL", label: "OFFICIAL" },
        { value: "CONTROVERSIAL", label: "CONTROVERSIAL" },
        { value: "RANDOM", label: "RANDOM" },
    ];

    const getChars = async () => {
        if (user) {
            return dispatch(getCar({ user: user?.result?._id }));

        }
        return null;
    }

    const getUsrs = async () => {
        await dispatch(getUsers(user?.result?._id)).then((res) => {
            //console.log('res:', res);
            setUsers(res);
        });
    }

    const getChanns = async () => {
        await dispatch(getChannels(user?.result?._id)).then((res) => {
            //console.log('channels:', res);
            setChannels(res);
        });
        //console.log('channels:', channels);
    }


    useEffect(() => {

        //console.log('ID', user?.result?._id);
        //getChannels();
        if (user) {
            getChanns();
            getUsrs();
            getChars().then((res) => {
                setInitialCar(res?.quota);
                //console.log('res', res);
            });
        }

        if (post) {
            setPostData(post);
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentId === 0 || currentId === null) {
            if ((DAILY - initialCar - caratteri > 0) || !(postData.destinatari.length > 0)) {
                if (postData.destinatari.length < 1 && postData.destinatariPrivati.length < 1) {
                    alert('Devi selezionare almeno un destinatario!');
                } else {
                    dispatch(createPost({ ...postData, name: user?.result?.name }));
                    if (postData.destinatari.length > 0) {
                        dispatch(updateQuota({ ...caratteri, user: user?.result?._id, quota: caratteri }));
                    }
                    clear();
                    navigate('/');
                }
            } else {
                if (postData.destinatari.length > 0) {
                    alert('Quota insufficiente');
                }
            }
        } else {

            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
            clear();
            navigate('/');
        }

    }

    const handleMessage = (e) => {
        setPostData({ ...postData, message: e.target.value });
        setCaratteri(e.target.value.length);
    }

    const clear = () => {
        setCurrentId(null);
        setPostData({ title: '', message: '', tags: '', selectedFile: '', destinatari: [], destinatariPrivati: [] });
    }

    const handleSelectChannels = (selectedOption, actionMeta) => {
        //console.log('handleSelect', selectedOption, actionMeta);
        setPostData({ ...postData, destinatari: selectedOption.map((dest) => dest.value) });
        //console.log(postData);
        if (actionMeta.action === 'create-option') {
            //console.log("CREAZIONE", actionMeta.option);
            actionMeta.option.label = actionMeta.option.label.toLowerCase();
            actionMeta.option.value = actionMeta.option.value.toLowerCase();
            dispatch(createChannel({ ...channels, owner: user?.result?._id, label: '$' + actionMeta.option.label, value: actionMeta.option.value }));
        }
    }

    const handleSelectUsers = (selectedOption, actionMeta) => {
        setPostData({ ...postData, destinatariPrivati: selectedOption.map((dest) => dest.value) });
        //console.log(postData);
    }

    const handleInputSelect = (inputValue, actionMeta) => {
        //console.log('handleInputSelect', inputValue, actionMeta);
    }

    const loadOptions = (searchValue, callback) => {
        setTimeout(() => {
            const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));
            //console.log('loadOptions', searchValue, filteredOptions);
            callback(filteredOptions);
        }, 1000);
    }

    const nome = (c) => {
        const foundItem = users.find(item => item.value === c);
        return foundItem ? foundItem.label : null;
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
                <Typography variant="h6" style={(DAILY - initialCar - caratteri < 0) ? { color: 'red' } : { color: 'black' }}> Caratteri restanti: {DAILY - initialCar - caratteri}</Typography>
                <TextField name="message" variant="outlined" label="Message" fullWidth multiline minRows={4} value={postData.message} onChange={handleMessage} />
                <TextField name="tags" variant="outlined" label="Tags (coma separated)" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />
                <Typography variant="h6">Destinatari (canali)</Typography>
                <CreateSelect className={classes.fileInput} value={postData.destinatari.map((c) => ({ value: c, label: "$" + c }))} isMulti options={channels} onChange={handleSelectChannels} onInputChange={handleInputSelect} />
                <Typography variant="h6">Destinatari (utenti)</Typography>
                <Select className={classes.fileInput} value={postData.destinatariPrivati.map((c) => ({ value: c, label: nome(c) }))} isMulti options={users} onChange={handleSelectUsers} onInputChange={handleInputSelect} />
                <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper >
    );
};

export default Form;