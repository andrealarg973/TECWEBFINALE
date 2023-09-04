import React, { useState, useEffect, useRef } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateQuota } from '../../actions/auth';

import useStyles from '../styles';

const IncreaseQuota = () => {
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();

    const input1 = useRef();
    const input2 = useRef();
    const input3 = useRef();
    const input4 = useRef();

    const handleSubmitQuota = async (e) => {
        e.preventDefault();

        dispatch(updateQuota({ user: user?.result?._id }));
        toast("Done!", { type: "success" });
    }

    const CreditCard = () => {
        return (
            <Grid container spacing={1} style={{ marginBottom: '10px' }}>
                <Grid item xs={12} >
                    <TextField required variant="outlined" name="cardNumber" label="Card Number" fullWidth ref={input1}></TextField>
                </Grid>
                <Grid item xs={12} >
                    <TextField required variant="outlined" name="cardHolder" label="Card Holder" fullWidth ref={input2}></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField required variant="outlined" name="expiryDate" label="Expiry Date" fullWidth ref={input3}></TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField required type='password' variant="outlined" name="cvv" label="CVV" fullWidth ref={input4}></TextField>
                </Grid>
            </Grid>
        );
    }

    return (
        <Container maxWidth="xs">
            <Paper className={classes.paper} elevation={6}>
                <form autoComplete="off" noValidate className={`${classes.form}`} onSubmit={handleSubmitQuota}>
                    <Typography variant="h6">Increase Quota (for 1 year)</Typography>
                    <CreditCard />
                    <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Buy</Button>
                    <ToastContainer autoClose={1000} hideProgressBar={true} />
                </form>
            </Paper>
        </Container>
    );
}

export default IncreaseQuota;