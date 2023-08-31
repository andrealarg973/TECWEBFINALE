import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';
//import memories from '../../images/memories.png';
import avvoltoio from '../../images/avvoltoio.jpg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import { getQuotas, getCar } from '../../actions/auth';
import ProgressBar from "@ramonak/react-progress-bar";

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
        await dispatch(getQuotas(user?.result?._id)).then((res) => {
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

    const progBarColor = (val, tot) => {
        const perc = val / tot;
        if (perc >= 0.3) {
            return '#32CD32';
        } else if (perc >= 0.1 && perc < 0.3) {
            return '#FFBF00';
        } else {
            return '#FF0000';
        }
    }

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div className={classes.brandContainer}>
                <Typography component={Link} to="/posts" onClick={handleBackHomePage} className={classes.heading} variant="h2" align="center">Squealer</Typography>
                <img className={classes.image} src={avvoltoio} alt="squealer" height="60" style={{ cursor: "pointer" }} onClick={handleBackHomePage} />
            </div>
            {user && (
                <Toolbar className={classes.quotabar} >
                    <Typography style={{ marginRight: '5%', marginLeft: '5%' }} variant="h6">Caratteri restanti:</Typography>
                    <Typography style={{ marginRight: '5%' }} variant="h6">Month: <ProgressBar className={classes.wrapper} height="30px" customLabelStyles={{ position: 'absolute', paddingLeft: '50px', paddingRight: '50px' }} labelColor='#000' labelAlignment='left' bgColor={progBarColor(quotas?.month, quotas?.monthTot)} completed={quotas?.month} maxCompleted={quotas?.monthTot} customLabel={(quotas?.month >= 0 ? String(quotas?.month) : '0')} /></Typography>
                    <Typography style={{ marginRight: '5%' }} variant="h6">Week: <ProgressBar className={classes.wrapper} height="30px" customLabelStyles={{ position: 'absolute', paddingLeft: '50px', paddingRight: '50px' }} labelColor='#000' labelAlignment='left' bgColor={progBarColor(quotas?.week, quotas?.weekTot)} completed={quotas?.week} maxCompleted={quotas?.weekTot} customLabel={(quotas?.week >= 0 ? String(quotas?.week) : '0')} /></Typography>
                    <Typography style={{ marginRight: '5%' }} variant="h6">Day: <ProgressBar className={classes.wrapper} height="30px" customLabelStyles={{ position: 'absolute', paddingLeft: '50px', paddingRight: '50px' }} labelColor='#000' labelAlignment='left' bgColor={progBarColor(quotas?.day, quotas?.dayTot)} completed={quotas?.day} maxCompleted={quotas?.dayTot} customLabel={(quotas?.day >= 0 ? String(quotas?.day) : '0')} /></Typography>
                </Toolbar>
            )
            }
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
        </AppBar >
    );
};

export default Navbar;