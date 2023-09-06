import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers } from '../../actions/auth';

import Post from './Post/Post';

import useStyles from './styles';
const Posts = ({ setCurrentId }) => {
    const { posts, isLoading } = useSelector((state) => state.posts);
    const classes = useStyles();
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const user = JSON.parse(localStorage.getItem('profile'));

    const getUsrs = async () => {
        await dispatch(getUsers(user?.result?._id)).then((res) => {
            //console.log('res:', res);
            setUsers(res);
        });
    }

    useEffect(() => {
        if (user) {
            getUsrs();
        }
        //console.log(users);
    }, []);

    if (posts.length <= 0 && !isLoading) return 'no posts';

    //console.log(posts);
    return (
        isLoading ? <CircularProgress /> : (
            <Grid className={classes.container} container alignItems='stretch' spacing={3}>
                {posts.map((post) => (
                    <Grid key={post._id} item xs={12} sm={12} md={6} lg={4} xl={3}>
                        <Post post={post} setCurrentId={setCurrentId} users={users} />
                    </Grid>
                ))}
            </Grid>
        )
    );
}

export default Posts;