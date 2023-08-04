import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';
//import memories from '../../images/memories.png';
import avvoltoio from '../../images/avvoltoio.jpg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import { getPosts } from '../../actions/posts';

import useStyles from './styles';

const Navbar = () => {
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleBackHomePage = () => {
        dispatch(getPosts());
        navigate('/posts');
    }

    //const user = null;
    //console.log(user);

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/');
        setUser(null);
    }

    const openUserPage = () => {
        navigate('/profile');
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

    }, [location]);

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div className={classes.brandContainer}>
                <Typography component={Link} to="/posts" onClick={handleBackHomePage} className={classes.heading} variant="h2" align="center">Squealer</Typography>
                <img className={classes.image} src={avvoltoio} alt="squealer" height="60" style={{ cursor: "pointer" }} onClick={handleBackHomePage} />
            </div>
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