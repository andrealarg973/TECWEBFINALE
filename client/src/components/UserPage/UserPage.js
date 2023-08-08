import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import Posts from '../Posts/Posts';

import useStyles from './styles';

const UserPage = () => {
    const [currentId, setCurrentId] = useState(0);
    const classes = useStyles();

    return (
        <Grow in>
            <Container maxWidth="xl">
                <Grid container className={classes.gridContainer} justifyContent="space-between" alignItems="stretch" spacing={3}>
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper className={classes.paper} elevation={6}>
                            <Typography variant="h6">altro</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    );
}

export default UserPage;