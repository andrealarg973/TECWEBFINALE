import React, { useState, useEffect, useRef } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { getSMMs, setSMM, getMySMM } from '../../actions/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useStyles from '../styles';

function SelectSmm() {
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();
    const [smms, setSmms] = useState([]);
    const [smm, setSmm] = useState('');

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
        if (user?.result?.role !== 'vip') window.location.href = window.location.origin + '/react';

        if (user) {
            getMySmm();
            getSMM();
            //setSmms(smms.concat(smm));
            //console.log(smm);
        }
        //console.log(user?.result);
    }, []);

    return (
        <Container maxWidth="sm">
            <Paper className={classes.paper} elevation={6}>
                <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmitSMM}>
                    <Typography variant="h6">Select SMM</Typography>
                    <Select className={classes.fileInput} options={smms} value={smm} fullWidth onChange={handleSelectUsers} />
                    <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Confirm</Button>
                    <Button variant="contained" color="secondary" size="small" onClick={clearSMM} fullWidth>Remove SMM</Button>
                    <ToastContainer autoClose={1000} hideProgressBar={true} />
                </form>
            </Paper>
        </Container>
    );
}

export default SelectSmm;