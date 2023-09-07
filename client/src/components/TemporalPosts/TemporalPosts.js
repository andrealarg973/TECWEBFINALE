import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import Select from 'react-select';
import { getChannels } from '../../actions/channels';

import { getPostsBySearch } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Paginate from '../Pagination';
import { getTemporalPosts } from '../../actions/posts';

import useStyles from '../styles';

const TemporalPosts = () => {
    const [currentId, setCurrentId] = useState(0);
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const classes = useStyles();

    useEffect(() => {
        dispatch(getTemporalPosts(user?.result?._id));
    }, []);

    return (
        <Grow in>
            <Grid className={classes.gridContainer} container justifyContent="space-between" alignItems="stretch" spacing={3}>
                <Grid item xs={12} sm={6} md={8} xl={9}>
                    <Posts setCurrentId={setCurrentId} fullScreen={false} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={3}>
                    <Form currentId={currentId} setCurrentId={setCurrentId} />
                </Grid>
            </Grid>
        </Grow>
    );
}

export default TemporalPosts;