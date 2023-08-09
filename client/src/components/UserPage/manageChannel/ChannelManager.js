import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyles from '../styles';
import Channel from './Channel';

const ChannelManager = ({ channels }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    //const [channels, setChannels] = useState([]);

    return (
        <>
            {channels.map((channel) => (
                <Grid key={channel._id} item>
                    <Channel channel={channel} />
                </Grid>
            ))}
        </>
    );
}

export default ChannelManager;