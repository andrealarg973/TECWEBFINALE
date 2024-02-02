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
            //console.log(res);
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
                response.json().then(postInfos => {
                    const postInfo = { "status": "ok", "totalResults": 10, "articles": [{ "source": { "id": "techcrunch", "name": "TechCrunch" }, "author": "Mike Butcher", "title": "Signalling more consolidation may come, smart-bus startup Zeelo acquires Kura, a smaller player | TechCrunch", "description": "A small UK startup which combined a school bus service with a software platform to safeguard pupils has been acquired by ‘Smart buses’ startup Zeelo,", "url": "https://techcrunch.com/2024/02/01/zeelo/", "urlToImage": "https://techcrunch.com/wp-content/uploads/2024/02/Stephen-Perse-Foundation-1-1536x1024-1.jpeg?w=826", "publishedAt": "2024-02-01T11:23:33Z", "content": "A small UK startup which combined a school bus service with a software platform to safeguard pupils has been acquired by Smart buses startup Zeelo, which last year raised a $14 million war chest for … [+1237 chars]" }, { "source": { "id": "techcrunch", "name": "TechCrunch" }, "author": "Manish Singh", "title": "Byju's investors call for EGM to remove founder following rights issue | TechCrunch", "description": "A group of large investors in Byju's has called for an extraordinary general meeting seeking to change the leadership at Byju's days after the edtech A group of large investors in Byju's has called for an extraordinary general meeting seeking to change the le…", "url": "https://techcrunch.com/2024/02/01/byjus-investors-call-for-egm-to-remove-founder-following-rights-issue/", "urlToImage": "https://techcrunch.com/wp-content/uploads/2023/11/GettyImages-1257740205.jpg?resize=1200,800", "publishedAt": "2024-02-01T11:19:18Z", "content": "A group of large investors in Byju’s has called for an extraordinary general meeting seeking to change the leadership at Byju’s days after the edtech group launched a rights issue at $25 million pre-… [+3256 chars]" }, { "source": { "id": "techcrunch", "name": "TechCrunch" }, "author": "Christine Hall", "title": "Three San Francisco supervisors receive threats following YC President Garry Tan’s tweet | TechCrunch", "description": "Aaron Peskin says Garry Tan’s now deleted X post did “harm to democratic discourse.\"", "url": "https://techcrunch.com/2024/01/31/san-francisco-supervisors-threats-yc-garry-tans-tweet/", "urlToImage": "https://techcrunch.com/wp-content/uploads/2020/07/Screen-Shot-2020-07-27-at-2.50.35-PM-e1595967739422.png?resize=1200,653", "publishedAt": "2024-02-01T06:02:39Z", "content": "Y Combinator President Garry Tans online rant tweet may be deleted from X, however, the effects are lingering, especially for three San Francisco supervisors who have now received threats.\r\nAaron Pes… [+2431 chars]" }, { "source": { "id": "techcrunch", "name": "TechCrunch" }, "author": "Manish Singh", "title": "India's central bank discusses more penalties on Paytm Payments Bank, including revoking license | TechCrunch", "description": "The Reserve Bank of India is discussing more penalties on Paytm Payments Bank and may reach a decision within days, two sources familiar with the matter", "url": "https://techcrunch.com/2024/01/31/indias-central-bank-discusses-more-penalties-on-paytm-payments-bank-including-revoking-license/", "urlToImage": "https://techcrunch.com/wp-content/uploads/2020/04/GettyImages-634064462.jpg?resize=1200,800", "publishedAt": "2024-02-01T06:01:57Z", "content": "The Reserve Bank of India is discussing more penalties on Paytm Payments Bank and may reach a decision within days, two sources familiar with the matter told TechCrunch.\r\nThe central bank has interna… [+1708 chars]" }, { "source": { "id": "techcrunch", "name": "TechCrunch" }, "author": "Manish Singh", "title": "Reliance-backed Viacom18 agrees to buy 60% of Disney's India unit, report says | TechCrunch", "description": "Reliance-backed Viacom18 has reached an agreement to buy 60% of Disney's India unit, WSJ reported Thursday citing unnamed sources, creating a pathway for Reliance-backed Viacom18 has reached an agreement to buy 60% of Disney's India unit, WSJ reported Thursda…", "url": "https://techcrunch.com/2024/01/31/reliance-backed-viacom18-agrees-to-buy-60-of-disney-india-unit-report-says/", "urlToImage": "https://techcrunch.com/wp-content/uploads/2023/03/GettyImages-142507970.jpg?resize=1200,701", "publishedAt": "2024-02-01T04:08:17Z", "content": "Reliance-backed Viacom18 has reached an agreement to buy 60% of Disney’s India unit, WSJ reported Thursday citing unnamed sources, creating a pathway for the Indian conglomerate to form a $10 billion… [+2176 chars]" }, { "source": { "id": "techcrunch", "name": "TechCrunch" }, "author": "Catherine Shu", "title": "CARPL guides healthcare providers through the growing market of radiology AI apps | TechCrunch", "description": "There’s an acute shortage of radiologists around the world, which means it is harder for medical teams to get imaging studies done. As a result, more than There’s an acute shortage of radiologists around the world, which means it is harder for medical teams t…", "url": "https://techcrunch.com/2024/02/01/carpl/", "urlToImage": "https://techcrunch.com/wp-content/uploads/2024/01/GettyImages-104509077.jpg?resize=1200,800", "publishedAt": "2024-02-01T02:16:30Z", "content": "Theres an acute shortage of radiologists around the world, which means it is harder for medical teams to get imaging studies done. As a result, more than 200 companies have sprung up to create applic… [+5587 chars]" }, { "source": { "id": "techcrunch", "name": "TechCrunch" }, "author": "Manish Singh", "title": "Paytm to terminate business with Paytm Payments Bank after central bank's clampdown | TechCrunch", "description": "Paytm said Thursday that it will cease working with its associate Paytm Payments Bank and accelerate plans to partner with other banks, after India's Paytm will cease working with its associate Paytm Payments Bank and accelerate plans to partner with other ba…", "url": "https://techcrunch.com/2024/01/31/paytm-to-terminate-business-with-paytm-payments-bank-after-central-bank-clampdown/", "urlToImage": "https://techcrunch.com/wp-content/uploads/2020/09/GettyImages-631364290.jpg?resize=1200,800", "publishedAt": "2024-02-01T01:59:41Z", "content": "Paytm said Thursday that it will cease working with its associate Paytm Payments Bank and accelerate plans to partner with other banks, after India’s central bank barred Paytm Payments Bank from cond… [+2585 chars]" }, { "source": { "id": "techcrunch", "name": "TechCrunch" }, "author": "Jacquelyn Melinek", "title": "AI and blockchains might need one another to evolve, according to new report | TechCrunch", "description": "Even though the two sectors are reaching different levels of mainstream adoption, they are also facing challenges that the other could potentially help alleviate.", "url": "https://techcrunch.com/2024/02/01/ai-and-blockchains-might-need-one-another-to-evolve/", "urlToImage": "https://techcrunch.com/wp-content/uploads/2024/01/GettyImages-1336275511.jpg?resize=1200,800", "publishedAt": "2024-02-01T01:26:31Z", "content": "Some of the biggest technological innovations have transpired over the past few years across the artificial intelligence and blockchain industries, independently.\r\nAnd even though the two sectors are… [+751 chars]" }, { "source": { "id": "techcrunch", "name": "TechCrunch" }, "author": "Christine Hall", "title": "Planet A Foods whips up more capital to take its cocoa-free chocolate global | TechCrunch", "description": "Planet A Foods uses fermentation technology to turn ingredients, like oats and sunflower seeds, into its cocoa-free chocolate brand, ChoViva.", "url": "https://techcrunch.com/2024/02/01/planet-a-foods-cocoa-free-chocolate/", "urlToImage": "https://techcrunch.com/wp-content/uploads/2024/01/Pilsen_Factory-02-Picture_-Planet-A-Foods.jpg?resize=1200,675", "publishedAt": "2024-02-01T01:07:07Z", "content": "Planet A Foods, a B2B sustainable ingredients company, announced $15.4 million in Series A funding.\r\nThe brother-and-sister founding team of Drs. Max and Sara Marquart started the Munich-based compan… [+2833 chars]" }, { "source": { "id": "techcrunch", "name": "TechCrunch" }, "author": "Brian Heater", "title": "Apple Vision Pro: Day One | TechCrunch", "description": "It’s Friday, February 2, 2024. Today is the day. You’ve been eyeing the Vision Pro since Tim Cook stepped onstage with the product at last year’s WWDC.", "url": "https://techcrunch.com/2024/01/31/apple-vision-pro-day-one/", "urlToImage": "https://techcrunch.com/wp-content/uploads/2024/01/CMC_7623.jpg?resize=1200,800", "publishedAt": "2024-01-31T22:42:46Z", "content": "Its Friday, February 2, 2024. Today is the day. Youve been eyeing the Vision Pro since Tim Cook stepped onstage with the product at last years WWDC. Longer than that, really, if you factor in the yea… [+5769 chars]" }] };
                    //console.log(postInfo);
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
                dispatch(updateTemporal(currentId, { ...postData, repeat: time, active: switchController }));
                clear();
                navigate('/temporalPosts');
            } else {
                console.log(currentId);
                if ((Math.min(quotas.day, quotas.week, quotas.month) - caratteri >= 0) || (postData.destinatariPrivati.length > 0) || temporal) {
                    //if (postData.destinatari.length < 1 && postData.destinatariPrivati.length < 1) {
                    //alert('Devi selezionare almeno un destinatario!');
                    //} else {
                    const privacy = (postData.destinatariPrivati.length <= 0 && postData.destinatari.length <= 0 && post.privacy === 'public') ? 'public' : 'private';
                    //console.log(post.privacy);
                    if (temporal) {
                        dispatch(createPostTemporal({ ...postData, name: user?.result?.name, reply: currentId, privacy: privacy, location: (markerRef.current !== null ? [markerRef?.current?.getLatLng()?.lat, markerRef?.current?.getLatLng()?.lng] : [9999, 9999]), repeat: (time >= 10 ? time : 10) }));
                    } else {
                        dispatch(createPost({ ...postData, name: user?.result?.name, privacy: privacy, destinatariPrivati: postData.destinatariPrivati.concat([post.creator]), reply: currentId, location: (markerRef.current !== null ? [markerRef?.current?.getLatLng()?.lat, markerRef?.current?.getLatLng()?.lng] : [9999, 9999]) }));
                        console.log(postData.destinatariPrivati);
                        console.log({ value: post.creator, label: "@" + post.name });
                        console.log(postData.destinatariPrivati.concat([{ value: post.creator, label: "@" + post.name }]));
                    }
                    //console.log(postData);
                    //if (postData.destinatari.length > 0) {
                    //dispatch(updateQuota({ ...caratteri, user: user?.result?._id, quota: caratteri }));
                    //}
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
        //setLocation(markerRef.current.getLatLng())
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
                    Please Sign In to create your post.
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
                        setLocation(marker.getLatLng());
                    }
                },
            }),
            [],
        );
        if (location.length > 0) {
            const position = [location[0], location[1]];
            return (
                <Map position={position} height={'50vh'} zoom={13} scrollWheelZoom={true} dragging={true} draggableMarker={(user?.result?.role === 'smm' ? true : false)} markerRef={markerRef} notPathMap={true} />
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
                        <Select className={classes.fileInput} value={currentId ? ({ value: post.creator, label: "@" + post.name }) : (postData.destinatariPrivati.map((c) => ({ value: c, label: "@" + nome(c) })))} isMulti options={users} onChange={handleSelectUsers} onInputChange={handleInputSelect} />
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