import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Container, TextField, Button, Typography, Paper, CircularProgress } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import CreateSelect from 'react-select/creatable';
import Select from 'react-select';
import ChipInput from 'material-ui-chip-input';
import Tooltip from '@mui/material/Tooltip';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import UploadFile from '../UploadFile/UploadFile';

import useStyles from './styles';
import { createPost, createPostTemporal, updatePost, updateTemporal } from '../../actions/posts';
import { getUsers, updateQuota, getCar, getQuotas } from '../../actions/auth';
import { getWritableChannels, createChannel } from '../../actions/channels';
import { useNavigate } from 'react-router-dom';
import Map from '../Map/Map';

//import { Marker, Popup } from 'leaflet';

// get the current id of the post



const Form = ({ currentId, setCurrentId }) => {
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: [],
        selectedFile: '',
        privacy: 'public',
        type: 'text',
        reply: '',
        location: [],
        destinatari: [],
        destinatariPrivati: [],
    });
    const post = useSelector((state) => (currentId ? state.posts.posts.find((p) => p._id === currentId) : null));
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();
    const [caratteri, setCaratteri] = useState(0);
    const markerRef = useRef(null);
    /*
    const [initialCar, setInitialCar] = useState(0);
    const [maxCar, setMaxCar] = useState({
        day: 0,
        week: 0,
        month: 0
    });*/
    const [temporal, setTemporal] = useState(false);
    const [channels, setChannels] = useState([]);
    const [time, setTime] = useState(10);
    const [users, setUsers] = useState([]);
    const [quotas, setQuotas] = useState({
        day: 0,
        week: 0,
        month: 0
    });
    const [location, setLocation] = useState([]);
    const replyRef = useRef();
    const [switchController, setSwitchController] = useState(false);

    const [dataFromChild, setDataFromChild] = useState('');

    // Callback function to receive data from the child component
    const receiveDataFromChild = (data) => {
        setDataFromChild(data);
        setPostData({ ...postData, selectedFile: data });
    };

    const getQTAs = async () => {
        await dispatch(getQuotas(user.result._id)).then((res) => {
            setQuotas(res);
        });
        /*
        await dispatch(getCar({ user: user?.result?._id })).then((res) => {
            setMaxCar(res);
            setInitialCar(Math.min(res.day, res.week, res.month) - Math.min(quotas.day, quotas.week, quotas.month));
        });
        */
    }
    /*
    const getChars = async () => {
        await dispatch(getCar({ user: user?.result?._id })).then((res) => {
            setMaxCar(res);
        });
    }
    */

    const getUsrs = async () => {
        await dispatch(getUsers(user?.result?._id)).then((res) => {
            //console.log('res:', res);
            setUsers(res);
        });
    }

    const getChanns = async () => {
        await dispatch(getWritableChannels(user?.result?._id)).then((res) => {
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

    const getRandomNews = async () => {
        //https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=ff7e09cfb7464b1c974afc87efe0ee54
        fetch('https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=ff7e09cfb7464b1c974afc87efe0ee54')
            .then(response => {
                response.json().then(postInfo => {
                    const num = postInfo.totalResults;
                    //console.log(postInfo.articles);
                    const article = postInfo.articles[Math.floor(Math.random() * num)];
                    const msg = "From " + article.author + ": " + article.title + "\n" + article.description + "...\n" + "Continue reading at: " + article.url;
                    //console.log(msg);
                    setPostData({ ...postData, message: msg });
                    setCaratteri(msg.length);
                });
            });
    }


    useEffect(() => {
        //console.log('ID', user?.result?._id);
        //getChannels();

        if (user) {
            //console.log(user);
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
            if (!post.repeat) {
                // reply post
                setPostData({ ...postData, reply: post._id, destinatari: post.destinatari, privacy: post.privacy });
            } else {
                // edit temporal post
                if (post.type === 'location') setLocation(post.location);
                setPostData(post);
                setTemporal(true);
                setTime(post.repeat);
                setSwitchController(post.active);
            }
            replyRef.current.scrollIntoView({ behavior: 'smooth' });
            //setPostData(post);
            //console.log(postData);
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //setPostData({ ...postData, location: location });
        //console.log(postData);
        //console.log(markerRef.current.getLatLng());
        //setLocation(markerRef.current.getLatLng());
        if (postData.type === 'media' && postData.selectedFile === '') {
            alert('You forgot to upload the media file');
            return;
        }

        if (currentId === 0 || currentId === null) {
            if ((Math.min(quotas.day, quotas.week, quotas.month) - caratteri >= 0) || (postData.destinatariPrivati.length > 0) || temporal) {
                if (temporal) {
                    dispatch(createPostTemporal({ ...postData, name: user?.result?.name, location: (markerRef.current !== null ? [markerRef?.current?.getLatLng()?.lat, markerRef?.current?.getLatLng()?.lng] : [9999, 9999]), repeat: (time >= 10 ? time : 10) }));
                } else {
                    console.log(markerRef);
                    dispatch(createPost({ ...postData, name: user?.result?.name, location: (markerRef.current !== null ? [markerRef?.current?.getLatLng()?.lat, markerRef?.current?.getLatLng()?.lng] : [9999, 9999]) }));
                }
                //console.log(postData);
                if (postData.destinatari.length > 0) {
                    //dispatch(updateQuota({ ...caratteri, user: user?.result?._id, quota: caratteri }));
                }
                clear();
                navigate('/');
                //}
            } else {
                alert('Quota insufficiente');

            }
        } else {
            if (postData.reply === '') {
                dispatch(updateTemporal(currentId, { ...postData, name: user?.result?.name, repeat: time, active: switchController }));
                clear();
                navigate('/temporalPosts');
            } else {

                if ((Math.min(quotas.day, quotas.week, quotas.month) - caratteri >= 0) || (postData.destinatariPrivati.length > 0) || temporal) {
                    //if (postData.destinatari.length < 1 && postData.destinatariPrivati.length < 1) {
                    //alert('Devi selezionare almeno un destinatario!');
                    //} else {
                    const privacy = (postData.destinatariPrivati.length <= 0 && postData.destinatari.length <= 0) ? 'public' : 'private';
                    if (temporal) {
                        dispatch(createPostTemporal({ ...postData, name: user?.result?.name, reply: currentId, privacy: privacy, location: (markerRef.current !== null ? [markerRef?.current?.getLatLng()?.lat, markerRef?.current?.getLatLng()?.lng] : [9999, 9999]), repeat: (time >= 10 ? time : 10) }));
                    } else {
                        dispatch(createPost({ ...postData, name: user?.result?.name, privacy: privacy, reply: currentId, location: (markerRef.current !== null ? [markerRef?.current?.getLatLng()?.lat, markerRef?.current?.getLatLng()?.lng] : [9999, 9999]) }));
                    }
                    //console.log(postData);
                    if (postData.destinatari.length > 0) {
                        //dispatch(updateQuota({ ...caratteri, user: user?.result?._id, quota: caratteri }));
                    }
                    clear();
                    navigate('/');
                    //}
                } else {
                    alert('Quota insufficiente');
                }
            }
        }
    }

    const handleSwitch = () => {
        setSwitchController(!switchController);
    }

    const handleMessage = (e) => {
        setPostData({ ...postData, message: e.target.value });
        setCaratteri(e.target.value.length);
    }

    const clear = () => {
        setCurrentId(null);
        setCaratteri(0);
        setTime(10);
        setTemporal(false);
        setPostData({ title: '', message: '', tags: '', selectedFile: '', type: 'text', privacy: 'public', reply: '', location: [], destinatari: [], destinatariPrivati: [] });
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

    if (user?.result?.blocked) {
        return (
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    Your account has been blocked! You are unable to post now.
                </Typography>
            </Paper>
        )
    }

    const handlePostTypeClick = (e) => {

        if (e.target.value === 'location') {
            //console.log("LOCATION...");
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        //setPostData({ ...postData, location: [latitude, longitude] });
                        setLocation([latitude, longitude]);
                        setCaratteri(125);
                        //console.log('Latitude:', latitude);
                        //console.log('Longitude:', longitude);
                        // Use latitude and longitude to display the user's location on a map, for example
                    },
                    (error) => {
                        console.error('Error getting location:', error.message);
                        // Handle error, e.g., show an error message to the user
                    }
                );
            } else {
                console.log("IMPOSSIBILE ACCEDERE ALLA POSIZIONE");
            }
        }
        if (e.target.value === 'media') {
            setCaratteri(postData.selectedFile ? 125 : 0);
        }
        if (e.target.value === 'text') {
            setCaratteri(postData.message.length);
        }

        setPostData({ ...postData, type: e.target.value });

        //console.log(postData.type);
    };

    const isChecked = (value) => {
        return value === postData.type;
    }

    const RadioButtons = () => {
        return (
            <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                <Typography variant="h6">Post type:</Typography>
                <input name="role" type="radio" value="text" onChange={handlePostTypeClick} checked={isChecked('text')} />Text
                <input name="role" type="radio" value="media" onChange={handlePostTypeClick} checked={isChecked('media')} />Media
                <input name="role" type="radio" value="location" onChange={handlePostTypeClick} checked={isChecked('location')} />Location
            </div>
        );
    }

    const Maps = () => {
        //<GetUserLocation />
        const markerEventHandler = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                        console.log(marker.getLatLng());
                        setLocation(marker.getLatLng())
                    }
                },
            }),
            [],
        );
        if (location.length > 0) {
            const position = [location[0], location[1]];
            return (
                <Map position={position} height={'50vh'} zoom={13} scrollWheelZoom={true} dragging={true} draggableMarker={(user?.result?.role === 'smm' ? true : false)} markerRef={markerRef} />
            );
        } else {
            return (
                <CircularProgress />
            );
        }
    }

    // <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
    // <TextField name="tags" variant="outlined" label="Tags (coma separated)" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />


    // <FileBase type="file" multiple={false} onDone={({ base64 }) => { setPostData({ ...postData, selectedFile: base64 }); setCaratteri(125); }} />
    return (

        <Paper className={classes.paper} elevation={6} ref={replyRef}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <div style={{ flexDirection: 'column' }}>
                    <Typography style={{ textAlign: 'center' }} variant="h4">{currentId ? (!post.repeat ? 'Reply to ' + post.name : 'Edit Post') : 'Create Post'}</Typography>
                    <RadioButtons />
                </div>

                {postData.type === 'text' && (
                    <>
                        <Tooltip placement="top" title="You can also use variables like {TIME}, {DATE}, {QUOTE} or {NEWS}. It will be changed after the post has been published">
                            <TextField required focused={currentId ? true : false} name="message" variant="outlined" label="Message" fullWidth multiline minRows={4} value={postData.message} onChange={handleMessage} />
                        </Tooltip>
                    </>
                )}
                {postData.type === 'media' && (
                    <div className={classes.fileInput}><UploadFile sendDataToParent={receiveDataFromChild} /></div>
                )}
                {postData.type === 'location' && (
                    <>
                        <Maps />
                    </>
                )}
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

                {postData.type === 'text' && (
                    <>
                        <Button className={classes.buttonSubmit} style={{ marginRight: '15px' }} variant="contained" color="primary" onClick={getRandomQuote} size="large" type="button">Random Quote</Button>
                        <Button className={classes.buttonSubmit} variant="contained" color="primary" onClick={getRandomNews} size="large" type="button">Random Tech News</Button>
                    </>
                )}

                <Typography variant="h6">Messaggio Temporizzato</Typography>
                <input name="temporal" type="CHECKBOX" checked={temporal} disabled={post?.repeat ? true : false} placeholder='ciao' value="temporal" className={classes.check} onChange={handleRadioClick} />
                {temporal && (
                    <>
                        <div style={{ marginBottom: '10px' }}>Ogni quanto vuoi pubblicare il messaggio? (in secondi)</div>
                        <Tooltip placement="top" title="Minimum 10 seconds, it will set automatically to 10 if lower">
                            <input className={classes.inputTime} min="10" value={time} onChange={(e) => setTime(e.target.value)} type="number"></input>
                        </Tooltip>
                    </>
                )}
                {post?.repeat && (
                    <FormGroup style={{ marginLeft: '15px' }}>
                        <FormControlLabel control={<Switch checked={switchController} onChange={handleSwitch} />} label="Active" />
                    </FormGroup>
                )}
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
            </form>
        </Paper >

    );
};

export default Form;