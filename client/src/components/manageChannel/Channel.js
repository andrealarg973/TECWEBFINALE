import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Typography, CardContent } from '@material-ui/core';
import { getUsers } from '../../actions/auth';
import { updateChannel } from '../../actions/channels';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStyles from '../styles';

const Channel = ({ channel }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [channelData, setChannelData] = useState({
        privacy: '',
        value: '',
        label: '',
        owner: [],
        participants: []
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

    const handleSelectChannels = (selectedOption, actionMeta) => {
        //console.log('handleSelect', selectedOption, actionMeta);
        setChannelData({ ...channelData, participants: selectedOption.map((dest) => dest.value) });
        //console.log(channelData);
    }

    const handleSelectOwner = (selectedOption, actionMeta) => {
        //console.log('handleSelect', selectedOption, actionMeta);
        setChannelData({ ...channelData, owner: selectedOption.map((dest) => dest.value) });
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

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <div style={{ flexDirection: 'column' }}>
                    <Typography variant="h4" paragraph className={classes.channelTitle}>${channelData.value}</Typography>
                    <Typography variant="h6" style={{ textAlign: 'center' }}>Owners:</Typography>
                </div>
                <Select className={classes.fileInput} isMulti value={channelData.owner.map((participant) => ({
                    value: participant, label: nome(participant)
                }))} onChange={handleSelectOwner} options={users} />
                <Typography variant="h6">Participants:</Typography>
                {channelData.privacy !== 'private' ? (
                    <>
                        <Select isDisabled className={classes.fileInput} isMulti value={channelData.participants.map((participant) => ({
                            value: participant, label: nome(participant)
                        }))} onChange={handleSelectChannels} options={users} />
                    </>
                ) : (
                    <>
                        <Select className={classes.fileInput} isMulti value={channelData.participants.map((participant) => ({
                            value: participant, label: nome(participant)
                        }))} onChange={handleSelectChannels} options={users} />
                    </>
                )}

                <div style={{ marginBottom: '10px' }}>
                    <Typography variant="h6" style={{ textAlign: 'center' }}>Privacy:</Typography>
                    <input name="privacy" type="radio" value="public" onChange={handleRadioClick} defaultChecked={checkPrivacy('public')} />Public
                    <input name="privacy" type="radio" value="private" onChange={handleRadioClick} defaultChecked={checkPrivacy('private')} />Private
                    <input name="privacy" type="radio" value="closed" onChange={handleRadioClick} defaultChecked={checkPrivacy('closed')} />Closed
                </div>
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                <ToastContainer autoClose={1000} hideProgressBar={true} />
            </form>
        </Paper>
    );
}

export default Channel;