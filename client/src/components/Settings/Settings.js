import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useStyles from './styles';
import Input from '../Auth/Input';
//import Icon from './icon';
import { ToastContainer, toast } from 'react-toastify';
import { updatePassword } from '../../actions/auth';

const initialState = { oldPassword: '', newPassword: '', confirmPassword: '' };

const Settings = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const classes = useStyles();
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleShowPassword1 = () => setShowPassword1((prevShowPassword1) => !prevShowPassword1);
    const handleShowPassword2 = () => setShowPassword2((prevShowPassword2) => !prevShowPassword2);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.newPassword === formData.confirmPassword) {
            dispatch(updatePassword(user?.result?._id, formData, navigate));
            toast("Password Changed!", { type: "success" });
        } else {
            alert("Passwords don't match");
        }

    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">Password Change</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Input name="oldPassword" label="Old Password" handleChange={handleChange} type={showPassword1 ? "text" : "password"} handleShowPassword={handleShowPassword1} />
                        <Input name="newPassword" label="New Password" handleChange={handleChange} type={showPassword2 ? "text" : "password"} handleShowPassword={handleShowPassword2} />
                        <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" />

                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} >
                        Change Password
                    </Button>
                    <ToastContainer autoClose={1000} hideProgressBar={true} />
                </form>
            </Paper >

        </Container >
    );
}

export default Settings;