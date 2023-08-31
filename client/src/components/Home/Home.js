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

import useStyles from './styles';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const [currentId, setCurrentId] = useState(0);
    const dispatch = useDispatch();
    const query = useQuery();
    const navigate = useNavigate();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const user = JSON.parse(localStorage.getItem('profile'));
    const classes = useStyles();
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
    const [channels, setChannels] = useState([]);
    const [channel, setChannel] = useState('');

    const getChanns = async () => {
        await dispatch(getChannels(user?.result?._id)).then((res) => {
            //console.log('channels:', res);
            setChannels(res);
        });
        //console.log('channels:', channels);
    }

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            // search for the post
            searchPost();
        }
    };

    const handleAdd = (tag) => setTags([...tags, tag]);
    const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));

    const searchPost = () => {
        if (search.trim() || tags || channel) {
            // dispatch -> fetch search post
            dispatch(getPostsBySearch({ search, tags: tags.join(', '), channel: channel.value }));
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}&channel=${channel.value}`);
        } else {
            navigate('/');
        }
    }

    const handleSelectChannel = (selectedOption, actionMeta) => {
        //console.log(selectedOption, actionMeta);
        if (selectedOption !== null) {
            setChannel({ label: selectedOption.label, value: selectedOption.value });
        } else {
            setChannel('');
        }
        //console.log(channel);
    }

    useEffect(() => {
        getChanns();
    }, []);

    return (
        <Grow in>
            <Container maxWidth="xl">
                <Grid className={classes.gridContainer} container justifyContent="space-between" alignItems="stretch" spacing={3}>
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppBar className={classes.appBarSearch} position="static" color="inherit">
                            <TextField name="search" variant="outlined" label="Search Post" onKeyUp={handleKeyPress} fullWidth value={search} onChange={(e) => { setSearch(e.target.value) }} />
                            <ChipInput style={{ margin: '10px 0' }} value={tags} onAdd={handleAdd} onDelete={handleDelete} label="Search Tags" variant="outlined" />
                            <Select fullWidth placeholder="Search Channel" isClearable className={classes.fileInput} options={channels} value={channel} onChange={handleSelectChannel} />
                            <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">Search</Button>
                        </AppBar>
                        <Form currentId={currentId} setCurrentId={setCurrentId} />
                        {(!searchQuery && !tags.length) && (
                            <Paper elevation={6} className={classes.pagination}>
                                <Paginate page={page} />
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    );
};

export default Home;