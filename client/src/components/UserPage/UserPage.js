import React, { useState, useEffect, useRef } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPostsByUser } from '../../actions/posts';
import IncreaseQuota from '../IncreaseQuota/IncreaseQuota';
import SelectSmm from '../SelectSMM/SelectSmm';
import ChannelManager from '../manageChannel/ChannelManager';

import Posts from '../Posts/Posts';

import useStyles from './styles';

const UserPage = () => {
    const [currentId, setCurrentId] = useState(0);
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getPostsByUser(user.result._id));
    }, []);

    return (
        <Grow in>
            <Posts setCurrentId={setCurrentId} fullScreen={true} />
        </Grow >
    );
}

export default UserPage;