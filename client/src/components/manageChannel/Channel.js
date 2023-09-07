import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Paper, AppBar, ButtonBase, TextField, Button, Typography, CardContent } from '@material-ui/core';
import { getUsers } from '../../actions/auth';
import { updateChannel } from '../../actions/channels';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStyles from '../styles';
import { useNavigate } from 'react-router-dom';

const Channel = ({ channel }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [channelData, setChannelData] = useState({
        privacy: '',
        value: '',
        label: '',
        desc: '',
        owner: [],
        read: [],
        write: [],
    });
    //const [participants, setParticipants] = useState([]);
    const [users, setUsers] = useState([]);

    const getUsrs = async () => {
        await dispatch(getUsers(user?.result?._id)).then((res) => {
            setUsers(res);
        });
    }

    const nome = (c) => {
        const foundItem = users.find(item => item.value === c);
        return (foundItem ? foundItem.label : user.result.name);
    }

    useEffect(() => {
        getUsrs();
        //setParticipants(channel.participants);

        if (channel) {
            setChannelData(channel);
        }

    }, [channel]);

    const handleSelectOwner = (selectedOption, actionMeta) => {
        //console.log('handleSelect', selectedOption, actionMeta);
        setChannelData({ ...channelData, owner: selectedOption.map((dest) => dest.value) });
        //console.log(channelData);
    }
    const handleSelectWriter = (selectedOption, actionMeta) => {
        //console.log('handleSelect', selectedOption, actionMeta);
        setChannelData({ ...channelData, write: selectedOption.map((dest) => dest.value) });
        //console.log(channelData);
    }
    const handleSelectReader = (selectedOption, actionMeta) => {
        //console.log('handleSelect', selectedOption, actionMeta);
        setChannelData({ ...channelData, read: selectedOption.map((dest) => dest.value) });
        //console.log(channelData);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        //console.log(channelData?._id);
        dispatch(updateChannel(channelData?._id, channelData));
        toast("Done!", { type: "success" });

    }

    const handleRadioClick = (e) => {
        setChannelData({ ...channelData, privacy: e.target.value });
        //console.log(channelData);
    }

    const checkPrivacy = (e) => {
        return e === channel.privacy;
    }

    const openChannelPage = () => {
        console.log(channelData._id);
        navigate(`/channelPage/${channelData.value}`);
    }

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <ButtonBase onClick={openChannelPage}>
                    <Typography variant="h4" style={{ textAlign: 'center' }} paragraph className={classes.channelTitle}>{channelData.label}</Typography>
                </ButtonBase>
                <TextField required name="desc" variant="outlined" label="Description" fullWidth multiline minRows={2} value={channelData.desc} onChange={((e) => setChannelData({ ...channelData, desc: e.target.value }))} />

                <Typography variant="h6" style={{ textAlign: 'center' }}>Owners:</Typography>
                <Select className={classes.fileInput} isMulti value={channelData.owner.map((participant) => ({
                    value: participant, label: nome(participant)
                }))} onChange={handleSelectOwner} options={users} />
                {channelData.privacy !== 'reserved' && (
                    <>
                        <Typography variant="h6">Can Write:</Typography>
                        <Select className={classes.fileInput} isMulti value={channelData.write.map((participant) => ({
                            value: participant, label: nome(participant)
                        }))} onChange={handleSelectWriter} options={users} />
                        <Typography variant="h6">Can Read:</Typography>
                        <Select className={classes.fileInput} isMulti value={channelData.read.map((participant) => ({
                            value: participant, label: nome(participant)
                        }))} onChange={handleSelectReader} options={users} />
                    </>
                )}

                <div style={{ marginBottom: '10px' }}>
                    <Typography variant="h6" style={{ textAlign: 'center' }}>Privacy:</Typography>
                    <input name="privacy" type="radio" value="public" onChange={handleRadioClick} defaultChecked={checkPrivacy('public')} />Public
                    <input name="privacy" type="radio" value="private" onChange={handleRadioClick} defaultChecked={checkPrivacy('private')} />Private
                    <input name="privacy" type="radio" value="closed" onChange={handleRadioClick} defaultChecked={checkPrivacy('closed')} />Closed
                    {channelData.privacy === 'reserved' && (
                        <>
                            <input name="privacy" type="radio" value="reserved" onChange={handleRadioClick} defaultChecked={checkPrivacy('reserved')} />Reserved
                        </>
                    )}
                </div>
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <ToastContainer autoClose={1000} hideProgressBar={true} />
            </form>
        </Paper>
    );
}

export default Channel;