import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, ButtonBase, Typography, CardContent } from '@material-ui/core';
import { getUsers } from '../../actions/auth';
import { updateChannel } from '../../actions/channels';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import useStyles from '../styles';

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (channelData.read.find((u) => u === user?.result?._id) || channelData.write.find((u) => u === user?.result?._id)) {
            // unsub
            dispatch(updateChannel(channelData?._id, { ...channelData, read: channelData.read.filter((u) => u !== user?.result?._id), write: channelData.write.filter((u) => u !== user?.result?._id) }));
            setChannelData({ ...channelData, read: channelData.read.filter((u) => u !== user?.result?._id), write: channelData.write.filter((u) => u !== user?.result?._id) });
            toast("Unubscribed!", { type: "warning" });
        } else {
            // sub
            dispatch(updateChannel(channelData?._id, { ...channelData, read: channelData.read.concat([user?.result?._id]) }));
            setChannelData({ ...channelData, read: channelData.read.concat([user?.result?._id]) });
            toast("Subscribed!", { type: "success" });
        }
    }

    const openChannelPage = () => {
        console.log(channelData._id);
        navigate(`/channelPage/${channelData.value}`);
    }

    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <ButtonBase className={classes.cardAction} onClick={openChannelPage} style={{ flexDirection: 'column', width: '100%' }}>

                    <Typography variant="h4" style={{ textAlign: 'center' }} paragraph className={classes.channelTitle}>{channelData.label}</Typography>
                    <Typography variant="body1" label="Description" > {channelData.desc} </Typography>
                    <Typography variant="h6" style={{ textAlign: 'center' }}>Owners:</Typography>
                    <Select className={classes.fileInput} isDisabled={true} isMulti value={channelData.owner.map((participant) => ({
                        value: participant, label: nome(participant)
                    }))} />

                </ButtonBase>
                {(channelData.read.find((u) => u === user?.result?._id) || channelData.write.find((u) => u === user?.result?._id)) ? (
                    <Button className={classes.buttonSubmit} variant="contained" color="secondary" size="large" type="submit" fullWidth>Unsubscribe</Button>
                ) : (
                    <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Subscribe</Button>
                )}

                <ToastContainer autoClose={1000} hideProgressBar={true} />
            </form>
        </Paper>
    );
}

export default Channel;