import React, { useState, useRef } from 'react';
import { Avatar, Button as Butt, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useStyles from './styles';
import Input from '../Auth/Input';
//import Icon from './icon';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ToastContainer, toast } from 'react-toastify';
import { updatePassword, deleteAccount } from '../../actions/auth';

import 'primeicons/primeicons.css';
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";


const initialState = { oldPassword: '', newPassword: '', confirmPassword: '' };

const Settings = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const classes = useStyles();
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const toast = useRef(null);
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

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        setUser(null);
        navigate('/');
    }

    const accept = () => {
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Account Deleted!', life: 3000 });
        setDeletingAccount(true);
        dispatch(deleteAccount({ _id: user?.result?._id }, navigate));
        /*
        setTimeout(() => {
            dispatch(deleteAccount({ _id: user?.result?._id }, navigate));
            logout();
        }, 3000);*/
        //logout();
    }

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'Operation Canceled', life: 3000 });
    }

    const confirm2 = () => {
        confirmDialog({
            message: 'This operation is irreversible. Do you want to proceed?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept,
            reject
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Toast ref={toast} />
                {deletingAccount ? (
                    <>
                        <Typography style={{ marginBottom: '40px', color: 'red' }} variant="h4">Deleting account...</Typography>
                        <i className="pi pi-spin pi-cog" style={{ fontSize: '20rem' }}></i>
                    </>
                ) : (
                    <>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography variant="h5">Password Change</Typography>
                        <form className={classes.form} onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Input name="oldPassword" label="Old Password" handleChange={handleChange} type={showPassword1 ? "text" : "password"} handleShowPassword={handleShowPassword1} />
                                <Input name="newPassword" label="New Password" handleChange={handleChange} type={showPassword2 ? "text" : "password"} handleShowPassword={handleShowPassword2} />
                                <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type={showPassword2 ? "text" : "password"} />

                            </Grid>
                            <Butt type="submit" fullWidth variant="contained" color="primary" className={classes.submit} >
                                Change Password
                            </Butt>
                            <ToastContainer autoClose={1000} hideProgressBar={true} />
                        </form>

                        <ConfirmDialog />
                        <div className="card flex flex-wrap gap-2 justify-content-center">
                            <Button onClick={confirm2} icon="pi pi-times" label="Delete Account" severity="danger" outlined></Button>
                        </div>
                    </>
                )}

            </Paper >

        </Container >
    );
}

export default Settings;