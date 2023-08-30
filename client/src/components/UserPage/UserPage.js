import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { getSMMs, setSMM, getMySMM } from '../../actions/auth';
import { getPostsByUser } from '../../actions/posts';
import ChannelManager from './manageChannel/ChannelManager';
import { getMyChannels } from '../../actions/channels';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Posts from '../Posts/Posts';

import useStyles from './styles';

const UserPage = () => {
    const [currentId, setCurrentId] = useState(0);
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();
    const [smms, setSmms] = useState([]);
    const [smm, setSmm] = useState('');
    const [channels, setChannels] = useState([]);
    const [newQuota, setNewQuota] = useState({ day: 0, week: 0, month: 0 });

    const getChannels = async () => {
        await dispatch(getMyChannels(user.result._id)).then((res) => {
            setChannels(res);
        });
    }


    const getSMM = async () => {
        await dispatch(getSMMs()).then((res) => {
            setSmms(res);
        });
    }

    const getMySmm = async () => {
        await dispatch(getMySMM(user.result._id)).then((res) => {
            setSmm(res);
        });
    }

    useEffect(() => {
        dispatch(getPostsByUser(user.result._id));
        if (user) {
            getMySmm();
            getSMM();
            getChannels();
            //setSmms(smms.concat(smm));
            //console.log(smm);
        }
        //console.log(user?.result);
    }, []);

    const handleSelectUsers = (selectedOption, actionMeta) => {
        setSmm(selectedOption);
    }

    const clearSMM = () => {
        setSmm('');
    }


    const handleSubmitSMM = async (e) => {
        e.preventDefault();

        dispatch(setSMM(user.result._id, (smm.value ? smm.value : '')));
        toast("Done!", { type: "success" });
        getSMM();
    }

    const handleSubmitQuota = async (e) => {
        e.preventDefault();
    }

    return (
        <Grow in>
            <Container maxWidth="xl">
                <Grid container className={classes.gridContainer} justifyContent="space-between" alignItems="stretch" spacing={3}>
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>


                        {user.result.role === 'vip' &&
                            <Paper className={classes.paper} elevation={6}>
                                <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmitSMM}>
                                    <Typography variant="h6">Select SMM</Typography>
                                    <Select className={classes.fileInput} options={smms} value={smm} fullWidth onChange={handleSelectUsers} />
                                    <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Confirm</Button>
                                    <Button variant="contained" color="secondary" size="small" onClick={clearSMM} fullWidth>Remove SMM</Button>
                                    <ToastContainer autoClose={1000} hideProgressBar={true} />
                                </form>
                            </Paper>
                        }
                        <Paper className={classes.paper} elevation={6}>
                            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmitQuota}>
                                <Typography variant="h6">Increase Quota</Typography>
                                <TextField required variant="outlined" label="Channel Name" fullWidth value={0} onChange={(e) => setNewQuota(e.target.value)}></TextField>
                                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Create</Button>
                            </form>
                        </Paper>
                        <Paper className={classes.paper} elevation={6}>
                            <Typography variant="h5" style={{ textAlign: 'center' }}>Channel Manager</Typography>
                            {channels.length > 0 ? (
                                <>
                                    <ChannelManager channels={channels}></ChannelManager>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6">Non possiedi nessun canale</Typography>

                                </>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Grow >
    );
}

export default UserPage;