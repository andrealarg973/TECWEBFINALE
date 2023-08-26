import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';
//import memories from '../../images/memories.png';
import avvoltoio from '../../images/avvoltoio.jpg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import { getQuotas, getCar } from '../../actions/auth';

import useStyles from './styles';

const Navbar = () => {
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [quotas, setQuotas] = useState({
        day: 0,
        week: 0,
        month: 0
    });
    const [maxCar, setMaxCar] = useState({
        day: 0,
        week: 0,
        month: 0
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleBackHomePage = () => {
        //dispatch(getPosts());
        navigate('/posts');
    }

    //const user = null;
    //console.log(user);

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        setUser(null);
        navigate('/');
    }

    const openUserPage = () => {
        navigate('/profile');
    }

    const getQTAs = async () => {
        await dispatch(getQuotas(user.result._id)).then((res) => {
            setQuotas(res);
        });
    }

    const getChars = async () => {

        await dispatch(getCar({ user: user?.result?._id })).then((res) => {
            setMaxCar(res);
        });
    }

    useEffect(() => {
        const token = user?.token;
        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) {
                logout();
            }
        }

        // JWT ...
        setUser(JSON.parse(localStorage.getItem('profile')));

        if (user) {
            getQTAs();
            //getChars();
        }

    }, [location]);

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div className={classes.brandContainer}>
                <Typography component={Link} to="/posts" onClick={handleBackHomePage} className={classes.heading} variant="h2" align="center">Squealer</Typography>
                <img className={classes.image} src={avvoltoio} alt="squealer" height="60" style={{ cursor: "pointer" }} onClick={handleBackHomePage} />
            </div>
            {user && (


                <div>
                    <Typography variant="h6">Caratteri restanti:</Typography>
                    <span>Month: {(quotas.month >= 0 ? quotas.month : 0)}</span>&nbsp;
                    <span>Week: {(quotas.week >= 0 ? quotas.week : 0)}</span>&nbsp;
                    <span>Day: {(quotas.day >= 0 ? quotas.day : 0)}</span>&nbsp;
                </div>
            )}
            <Toolbar className={classes.toolbar}>
                {user ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user.result.name} src={user.result.picture} style={{ cursor: "pointer" }} onClick={openUserPage}>{user.result.name.charAt(0)}</Avatar>
                        <Typography className={classes.username} variant="h6" style={{ cursor: "pointer" }} onClick={openUserPage}>{user.result.name}</Typography>
                        <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <Button component={Link} to="/auth" variant="contained" color="primary">Sign in</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;