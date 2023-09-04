import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyles from '../styles';
import Channel from './Channel';
import { createChannel } from '../../../actions/channels';
import { useNavigate } from 'react-router-dom';

const ChannelManager = ({ channels }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [newChannel, setNewChannel] = useState('');
    const [channels1, setChannels1] = useState(channels);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(e);
        dispatch(createChannel({ ...channels1, owner: [user?.result?._id], label: '$' + newChannel, value: newChannel })).then((res) => {
            //console.log(res);
            setChannels1(channels1.concat([res]));
        });
        //setChannels1(channels1.concat({ owner: [user?.result?._id], label: '$' + newChannel, value: newChannel, _id: '1234' }));
        setNewChannel('');
    }

    return (
        <Container maxWidth="xs">
            <Paper className={classes.paper} elevation={6}>
                <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                    <Typography variant="h6">Create Channel</Typography>
                    <TextField required variant="outlined" label="Channel Name" fullWidth value={newChannel} onChange={(e) => setNewChannel(e.target.value)}></TextField>
                    <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Create</Button>
                </form>
            </Paper>
            {channels1.map((channel) => (
                <Grid key={channel._id} item>

                    <Channel channel={channel} />
                </Grid>
            ))}
        </Container>
    );
}

export default ChannelManager;