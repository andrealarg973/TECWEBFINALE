import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import useStyles from '../styles';
import Channel from './Channel';
import { createChannel, getPublicChannels } from '../../actions/channels';

const ChannelList = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));

    const [newChannel, setNewChannel] = useState({
        privacy: '',
        value: '',
        label: '',
        desc: '',
        owner: [user?.result?._id],
        read: [],
        write: [],
    });
    const [channels1, setChannels1] = useState([]);

    const getChannels = async () => {
        await dispatch(getPublicChannels(user.result._id)).then((res) => {
            setChannels1(res);
        });
    }

    useEffect(() => {
        if (user) {
            getChannels();
        }
    }, []);

    return (
        <Container maxWidth="xl">
            <Paper className={classes.paper} elevation={6}>
                <Typography variant="h3" style={{ textAlign: 'center' }}>Channels List</Typography>
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
                        <Typography variant="h6">Non ci sono canali disponibili</Typography>

                    </>
                )}
            </Paper>
        </Container>
    );
}

export default ChannelList;