import React, { useState, useRef } from 'react';
import { Avatar, Button, ButtonBase, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
//import { GoogleLogin } from 'react-google-login';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import useStyles from './styles';
import Input from './Input';
//import Icon from './icon';
import { signin, signup, resetPwd } from '../../actions/auth';
import { Toast } from 'primereact/toast';
import { ToastContainer, toast } from 'react-toastify';

import 'primeicons/primeicons.css';
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', picture: '', role: 'user' };

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [passwordReset, setPasswordReset] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useRef(null);

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordReset) {
            console.log('password reset');
            dispatch(resetPwd(formData, navigate));
        } else {
            if (isSignup) {
                await dispatch(signup(formData, navigate)).then((res) => {
                    if (!res) {
                        //console.log("Invalid Credentials");
                        toast.current.show({ severity: 'warn', summary: 'Not Signed Up', detail: 'Some data may be incorrect', life: 5000 });
                    }
                });
            } else {
                await dispatch(signin(formData, navigate)).then((res) => {
                    if (!res) {
                        //console.log("Invalid Credentials 1");
                        toast.current.show({ severity: 'warn', summary: 'Not Signed In', detail: 'Invalid Credentials', life: 5000 });
                    }
                });

            }
        }

    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const googleSuccess = async (res) => {

        const cred = res?.credential; // undefined if not found
        var result = jwt_decode(res.credential);
        //console.log(result);
        //console.log({ token: cred, result });
        //const token = res?.tokenId;
        dispatch(signin({ email: result.email, password: result.sub }, navigate)).then((res) => {
            if (res?.result) {
                //console.log('result found:');
                //console.log(res);
                //toast.current.show({ severity: 'success', summary: 'Signed In with Google', life: 5000 });
            } else {
                //console.log('no result');
                toast.current.show({ severity: 'success', summary: 'Signed Up with Google', life: 5000 });
                dispatch(signup({ firstName: result.given_name, lastName: result.family_name, email: result.email, password: result.sub, confirmPassword: result.sub, picture: result.picture, role: 'user' }, navigate));
                //console.log(res);
            }
        });

        /*
        if (isSignup) {
            dispatch(signup({ firstName: result.given_name, lastName: result.family_name, email: result.email, password: result.sub, confirmPassword: result.sub, picture: result.picture, role: 'user' }, navigate));
        } else {
            dispatch(signin({ email: result.email, password: result.sub }, navigate)).then((res) => console.log(res));
        }*/

        /*
        try {
            dispatch({ type: 'AUTH', data: { result, token: cred } });
            navigate('/');
        } catch (error) {
            console.log(error);
        }
        */
    };
    const googleFailure = (error) => {
        toast.current.show({ severity: 'warn', summary: 'Not Signed In', detail: 'Google sign in was unsuccessful!', life: 5000 });
        console.log("Google sign in was unsuccessful!");
        console.log(error);
    };

    const handleRadioClick = (e) => {
        setFormData({ ...formData, role: e.target.value });
        //console.log(formData);
    };

    const resetPassword = () => {
        //setFormData({ ...formData, role: e.target.value });
        setPasswordReset(true);
        //console.log('password reset');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Toast ref={toast} />
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign up' : 'Sign in'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    {passwordReset ? (
                        <>
                            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} >
                                Reset Password
                            </Button>
                            <Button type="button" fullWidth variant="contained" color="secondary" onClick={(() => setPasswordReset(false))} className={classes.submit} >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Grid container spacing={2}>
                                {isSignup && (
                                    <>
                                        <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                        <Input name="lastName" label="Last Name" handleChange={handleChange} autoFocus half />
                                    </>
                                )}
                                <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                                <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                                {!isSignup && (
                                    <ButtonBase className={classes.cardAction} onClick={resetPassword} >
                                        <Typography style={{ marginLeft: '10px', color: 'blue', textDecoration: 'underline' }} variant="body2">password reset</Typography>
                                    </ButtonBase>
                                )}
                                {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                                {isSignup && <div>
                                    <Typography variant="h6" style={{ textAlign: 'center' }}>Account type:</Typography>
                                    <input name="role" type="radio" value="user" onChange={handleRadioClick} defaultChecked />User
                                    <input name="role" type="radio" value="vip" onChange={handleRadioClick} />Vip
                                    <input name="role" type="radio" value="smm" onChange={handleRadioClick} />SMM
                                </div>}
                            </Grid>
                            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} >
                                {isSignup ? 'Sign Up' : 'Sign in'}
                            </Button>
                            <ToastContainer autoClose={1000} hideProgressBar={true} />

                            <GoogleOAuthProvider clientId="608973042252-v57p0u75d5dg4ve0m77dqnv251kqlivr.apps.googleusercontent.com">
                                <GoogleLogin
                                    onSuccess={googleSuccess}
                                    onError={googleFailure}
                                />
                            </GoogleOAuthProvider>
                            <Grid style={{ marginTop: '20px' }} container justifyContent="center">
                                <Grid>
                                    <Button onClick={switchMode}>
                                        {isSignup ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>

                    )}
                </form>
            </Paper >


        </Container >
    );
}

export default Auth;