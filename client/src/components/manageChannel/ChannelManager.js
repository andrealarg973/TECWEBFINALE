import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyles from '../styles';
import Channel from './Channel';
import { createChannel, getOwnedChannels } from '../../actions/channels';

const ChannelManager = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));

    const [newChannel, setNewChannel] = useState({
        privacy: 'public',
        value: '',
        label: '',
        desc: '',
        owner: [user?.result?._id],
        read: [],
        write: [],
    });
    const [channels1, setChannels1] = useState([]);

    const getChannels = async () => {
        await dispatch(getOwnedChannels(user.result._id)).then((res) => {
            setChannels1(res);
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(e);
        dispatch(createChannel({ ...channels1, owner: newChannel.owner, privacy: newChannel.privacy, value: newChannel.value.toLowerCase(), label: newChannel.label.toLowerCase(), desc: newChannel.desc })).then((res) => {
            //console.log(res);
            setChannels1(channels1.concat([res]));
        });
        //setChannels1(channels1.concat({ owner: [user?.result?._id], label: '$' + newChannel, value: newChannel, _id: '1234' }));
        setNewChannel({
            privacy: 'public',
            value: '',
            label: '',
            desc: '',
            owner: [user?.result?._id],
            read: [],
            write: [],
        });
    }

    const handleRadioClick = (e) => {
        setNewChannel({ ...newChannel, privacy: e.target.value });
        //console.log(channelData);
    }

    const checkPrivacy = (e) => {
        return e === newChannel.privacy;
    }

    useEffect(() => {
        if (user) {
            getChannels();
        }
    }, []);

    return (
        <>
            <Paper className={classes.paperContainer} elevation={6}>
                <Typography variant="h3" style={{ textAlign: 'center' }}>Channel Manager</Typography>
                <Container maxWidth="sm">
                    <Paper className={classes.paperContainer} elevation={6}>
                        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                            <Typography variant="h6">Create Channel</Typography>
                            <TextField required variant="outlined" label="Channel Name" fullWidth value={newChannel.value} onChange={(e) => setNewChannel({ ...newChannel, value: e.target.value, label: '$' + e.target.value })}></TextField>
                            <TextField required name="desc" variant="outlined" label="Description" fullWidth multiline minRows={2} value={newChannel.desc} onChange={((e) => setNewChannel({ ...newChannel, desc: e.target.value }))} />
                            <div style={{ marginBottom: '10px' }}>
                                <Typography variant="h6" style={{ textAlign: 'center' }}>Privacy:</Typography>
                                <input name="privacy" type="radio" value="public" onChange={handleRadioClick} defaultChecked={checkPrivacy('public')} />Public
                                <input name="privacy" type="radio" value="private" onChange={handleRadioClick} defaultChecked={checkPrivacy('private')} />Private
                                <input name="privacy" type="radio" value="closed" onChange={handleRadioClick} defaultChecked={checkPrivacy('closed')} />Closed
                            </div>
                            <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Create</Button>
                        </form>
                    </Paper>
                </Container>

            </Paper>
            {channels1.length > 0 ? (
                <>
                    <Grid className={classes.container} container alignItems='stretch' spacing={3}>
                        {
                            channels1.map((channel) => (
                                <Grid key={channel._id} item xs={12} sm={12} md={6} lg={4} xl={3}>
                                    <Channel channel={channel} />
                                </Grid>
                            ))
                        }
                    </Grid>
                </>
            ) : (
                <>
                    <Typography variant="h6">Non possiedi nessun canale</Typography>

                </>
            )}
        </>
    );
}

export default ChannelManager;