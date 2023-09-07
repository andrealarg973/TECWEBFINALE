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

    const [newChannel, setNewChannel] = useState('');
    const [channels1, setChannels1] = useState([]);

    const getChannels = async () => {
        await dispatch(getOwnedChannels(user.result._id)).then((res) => {
            setChannels1(res);
        });
    }

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

    useEffect(() => {
        if (user) {
            getChannels();
        }
    }, []);

    const Content = () => (
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
    );

    return (
        <Container maxWidth="xl">
            <Paper className={classes.paper} elevation={6}>
                <Typography variant="h5" style={{ textAlign: 'center' }}>Channel Manager</Typography>
                <Container maxWidth="sm">
                    <Paper className={classes.paper} elevation={6}>
                        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                            <Typography variant="h6">Create Channel</Typography>
                            <TextField required variant="outlined" label="Channel Name" fullWidth value={newChannel} onChange={(e) => setNewChannel(e.target.value)}></TextField>
                            <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Create</Button>
                        </form>
                    </Paper>
                </Container>
                {channels1.length > 0 ? (
                    <>
                        <Content />
                    </>
                ) : (
                    <>
                        <Typography variant="h6">Non possiedi nessun canale</Typography>

                    </>
                )}
            </Paper>
        </Container>
    );
}

export default ChannelManager;