import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { getSMMs, setSMM, getMySMM } from '../../actions/auth';
import { getPosts, getPostsBySearch, getPostsByUser } from '../../actions/posts';
import ChannelManager from './manageChannel/ChannelManager';

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
            //setSmms(smms.concat(smm));
            //console.log(smm);
        }
        //console.log(user?.result);
    }, []);

    const handleSelectUsers = (selectedOption, actionMeta) => {
        setSmm(selectedOption);
        //console.log(smm);
        //console.log(selectedOption);
        //setPostData({ ...postData, destinatariPrivati: selectedOption.map((dest) => dest.value) });
        //console.log(postData);
    }

    const clearSMM = () => {
        setSmm('');
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(setSMM(user.result._id, (smm.value ? smm.value : '')));
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
                                <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                                    <Typography variant="h6">Selezione SMM</Typography>
                                    <Select className={classes.fileInput} options={smms} value={smm} fullWidth onChange={handleSelectUsers} />
                                    <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Confirm</Button>
                                    <Button variant="contained" color="secondary" size="small" onClick={clearSMM} fullWidth>Remove SMM</Button>
                                </form>
                            </Paper>
                        }
                        <Paper className={classes.paper} elevation={6}>
                            <Typography variant="h5">Gestione canali</Typography>
                            {channels.length > 0 ? (
                                <> <Typography variant="h6">canali</Typography></>
                            ) : (
                                <>
                                    <Typography variant="h6">Non possiedi nessun canale</Typography>
                                    <ChannelManager></ChannelManager>
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