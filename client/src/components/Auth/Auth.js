import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
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
import { signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {
            dispatch(signup(formData, navigate));
        } else {
            dispatch(signin(formData, navigate));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const googleSuccess = async (res) => {
        //console.log(res);
        const cred = res?.credential; // undefined if not found
        var result = jwt_decode(res.credential);
        //console.log({ token: cred, result });
        //const token = res?.tokenId;

        try {
            dispatch({ type: 'AUTH', data: { result, token: cred } });
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };
    const googleFailure = (error) => {
        console.log("Google sign in was unsuccessful!");
        console.log(error);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign up' : 'Sign in'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {isSignup && (
                            <>
                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                <Input name="lastName" label="Last Name" handleChange={handleChange} autoFocus half />
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
                        {isSignup && <>
                            <input name="type" type="radio" value="user" onChange={console.log('A')} defaultChecked />default
                            <input name="type" type="radio" value="vip" onChange={console.log('B')} />VIP
                            <input name="type" type="radio" value="smm" onChange={console.log('C')} />SMM
                        </>}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} >
                        {isSignup ? 'Sign Up' : 'Sign in'}
                    </Button>

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
                </form>
            </Paper >

        </Container >
    );
}

export default Auth;