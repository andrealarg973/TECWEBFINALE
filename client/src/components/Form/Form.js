import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import CreateSelect from 'react-select/creatable';
import Select from 'react-select';
import ChipInput from 'material-ui-chip-input';

import useStyles from './styles';
import { createPost, createPostTemporal, updatePost } from '../../actions/posts';
import { getUsers, updateQuota, getCar, getQuotas } from '../../actions/auth';
import { getChannels, createChannel } from '../../actions/channels';
import { useNavigate } from 'react-router-dom';

// get the current id of the post

const Form = ({ currentId, setCurrentId }) => {
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: [],
        selectedFile: '',
        privacy: 'public',
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
    const [maxCar, setMaxCar] = useState({
        day: 0,
        week: 0,
        month: 0
    });
    const [temporal, setTemporal] = useState(false);
    const [channels, setChannels] = useState([]);
    const [time, setTime] = useState(10);
    const [users, setUsers] = useState([]);
    const [quotas, setQuotas] = useState({
        day: 0,
        week: 0,
        month: 0
    });
    const [tags, setTags] = useState([]);

    const getQTAs = async () => {
        await dispatch(getQuotas(user.result._id)).then((res) => {
            setQuotas(res);
        });
        await dispatch(getCar({ user: user?.result?._id })).then((res) => {
            setMaxCar(res);
            setInitialCar(Math.min(res.day, res.week, res.month) - Math.min(quotas.day, quotas.week, quotas.month));
        });
    }

    const getChars = async () => {
        await dispatch(getCar({ user: user?.result?._id })).then((res) => {
            setMaxCar(res);
        });
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

    const getRandomQuote = async () => {
        //https://api.quotable.io/random
        //https://api.whatdoestrumpthink.com/api/v1/quotes/random

        fetch('https://api.quotable.io/random')
            .then(response => {

                response.json().then(postInfo => {
                    setPostData({ ...postData, message: postInfo.content });
                    setCaratteri(postInfo.content.length);
                });
            });
    }


    useEffect(() => {

        //console.log('ID', user?.result?._id);
        //getChannels();

        if (user) {
            //getChars();
            getChanns();
            getUsrs();
            getQTAs();

            /*
            getChars().then((res) => {
                setInitialCar(res?.quota);
                //console.log('res', res);
            });
            */
        }

        if (post) {
            setPostData(post);
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentId === 0 || currentId === null) {
            if ((Math.min(quotas.day, quotas.week, quotas.month) - caratteri >= 0) || !(postData.destinatari.length > 0) || temporal) {
                //if (postData.destinatari.length < 1 && postData.destinatariPrivati.length < 1) {
                //alert('Devi selezionare almeno un destinatario!');
                //} else {
                if (temporal) {
                    dispatch(createPostTemporal({ ...postData, name: user?.result?.name, repeat: time }));
                } else {
                    dispatch(createPost({ ...postData, name: user?.result?.name }));
                }
                //console.log(postData);
                if (postData.destinatari.length > 0) {
                    dispatch(updateQuota({ ...caratteri, user: user?.result?._id, quota: caratteri }));
                }
                clear();
                navigate('/');
                //}
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
        setPostData({ title: '', message: '', tags: '', selectedFile: '', privacy: '', destinatari: [], destinatariPrivati: [] });
    }
    /*
    if (postData.destinatariPrivati.length <= 0 && postData.destinatari.length <= 0) {
            console.log('pubblico');
            setPostData({ ...postData, privacy: 'public' });
        } else {
            console.log('privato');
            setPostData({ ...postData, privacy: 'private' });
            console.log(postData);
        }
    */

    const handleSelectChannels = (selectedOption, actionMeta) => {

        if (selectedOption.length > 0) {
            setPostData({ ...postData, privacy: 'private', destinatari: selectedOption.map((dest) => dest.value) });
        } else {
            setPostData({ ...postData, privacy: 'public', destinatari: selectedOption.map((dest) => dest.value) });
        }
        //console.log(postData);
        if (actionMeta.action === 'create-option') {
            //console.log("CREAZIONE", actionMeta.option);
            actionMeta.option.label = actionMeta.option.label.toLowerCase();
            actionMeta.option.value = actionMeta.option.value.toLowerCase();
            dispatch(createChannel({ ...channels, owner: [user?.result?._id], label: '$' + actionMeta.option.label, value: actionMeta.option.value }));
        }
    }

    const handleSelectUsers = (selectedOption, actionMeta) => {
        if (selectedOption.length > 0) {
            setPostData({ ...postData, privacy: 'private', destinatariPrivati: selectedOption.map((dest) => dest.value) });
        } else {
            setPostData({ ...postData, privacy: 'public', destinatariPrivati: selectedOption.map((dest) => dest.value) });
        }
        //console.log(postData);
    }

    const handleInputSelect = (inputValue, actionMeta) => {
        //console.log('handleInputSelect', inputValue, actionMeta);
    }

    /*
    const loadOptions = (searchValue, callback) => {
        setTimeout(() => {
            const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));
            //console.log('loadOptions', searchValue, filteredOptions);
            callback(filteredOptions);
        }, 1000);
    }*/

    const nome = (c) => {
        const foundItem = users.find(item => item.value === c);
        return foundItem ? foundItem.label : null;
    }

    const handleChangeTags = (currentTags) => {
        const adjust = currentTags.map((tag) => tag.replace(/\s/g, ''));
        setPostData({ ...postData, tags: adjust });
        //console.log(currentTags);

    }

    const handleRadioClick = (e) => {
        //setFormData({ ...formData, role: e.target.value });
        //console.log(e);
        setTemporal(!temporal);
    };

    if (!user?.result?.name) {
        return (
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    Please Sign In to create your post
                </Typography>
            </Paper>
        )
    }

    // <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
    // <TextField name="tags" variant="outlined" label="Tags (coma separated)" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{currentId ? 'Edit Post' : 'Create Post'}</Typography>
                <TextField required name="message" variant="outlined" label="Message" fullWidth multiline minRows={4} value={postData.message} onChange={handleMessage} />
                <Typography align="right" className={classes.charLeft} variant="h6" style={(Math.min(quotas.day, quotas.week, quotas.month) - caratteri < 0) ? { color: 'red' } : { color: 'black' }}> Caratteri restanti: {Math.min(quotas.day, quotas.week, quotas.month) - caratteri}</Typography>

                <ChipInput helperText="All spaces will be removed" style={{ margin: '10px 0' }} onChange={handleChangeTags} label="Tags" variant="outlined" fullWidth />
                {postData.destinatariPrivati.length <= 0 && (
                    <>
                        <Typography variant="h6">Destinatari (canali)</Typography>
                        <CreateSelect className={classes.fileInput} value={postData.destinatari.map((c) => ({ value: c, label: "$" + c }))} isMulti options={channels} onChange={handleSelectChannels} onInputChange={handleInputSelect} />
                    </>
                )}
                {postData.destinatari.length <= 0 && (
                    <>
                        <Typography variant="h6">Destinatari (utenti)</Typography>
                        <Select className={classes.fileInput} value={postData.destinatariPrivati.map((c) => ({ value: c, label: "@" + nome(c) }))} isMulti options={users} onChange={handleSelectUsers} onInputChange={handleInputSelect} />
                    </>
                )}
                <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
                <Button className={classes.buttonSubmit} variant="contained" color="primary" onClick={getRandomQuote} size="large" type="button">Random Quote</Button>
                <Typography variant="h6">Messaggio Temporizzato</Typography>
                <input name="temporal" type="CHECKBOX" placeholder='ciao' value="temporal" className={classes.check} onChange={handleRadioClick} />
                {temporal && (
                    <>
                        <div style={{ marginBottom: '10px' }}>Ogni quanto vuoi pubblicare il messaggio? (in secondi)</div>
                        <input className={classes.inputTime} min="10" value={time} onChange={(e) => setTime(e.target.value >= 10 ? e.target.value : 10)} type="number"></input>
                    </>
                )}
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper >
    );
};

export default Form;