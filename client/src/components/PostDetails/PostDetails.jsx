import React, { useEffect, useState } from 'react';
import { Paper, Typography, CircularProgress, Divider, CardMedia, Card, ButtonBase, CardContent, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import ReplyIcon from '@mui/icons-material/Reply';

import Map from '../Map/Map';
import CommentSection from './CommentSection';
import { getPost } from '../../actions/posts';
import VisibilityIcon from '@material-ui/icons/Visibility';
import useStyles from './styles';
import { getUsers } from '../../actions/auth';
import { useNavigate } from 'react-router-dom';
import { updateVisual } from '../../actions/posts';
import { URL } from '../../constants/paths';

const PostDetails = ({ currentId, setCurrentId }) => {
    const { post, isLoading, replyPost } = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const user = JSON.parse(localStorage.getItem('profile'));
    //const navigate = useNavigate();
    const classes = useStyles();
    const { id } = useParams();

    const getUsrs = async () => {
        await dispatch(getUsers(user?.result?._id)).then((res) => {
            //console.log('res:', res);
            setUsers(res);
        });
    }

    useEffect(() => {
        dispatch(getPost(id));
        getUsrs();
        //console.log(replyPost);
    }, [dispatch, id]);

    const name = (c) => {
        const foundItem = users.find(item => item.value === c);
        return (foundItem ? '@' + foundItem.label + ' ' : '@' + user?.result?.name);
    }

    if (!post) return null;

    if (isLoading) {
        return (
            <Paper elevation={6} className={classes.loadingPaper}>
                <CircularProgress size="7em" className={classes.progress} />
            </Paper>
        );
    }

    const postReplied = () => {
        dispatch(updateVisual(post.reply));
        navigate(`/posts/${post.reply}`);
        //console.log(post);
    }

    const handleReply = () => {
        setCurrentId(post._id);
        navigate(`/newPost`);
    }

    const PostReply = ({ repPost }) => {
        return (
            <>
                {repPost?.name ? (
                    <Card className={classes.cardReply} raised elevation={8}>
                        <ButtonBase className={classes.cardAction} onClick={postReplied}>
                            <div className={classes.details} >
                                <Typography variant="body2">Reply to: {repPost.name}</Typography>
                            </div>
                            <CardContent>
                                {repPost.type === 'media' && (
                                    repPost.selectedFile.split('.').pop() === 'mp4' ? (
                                        <>
                                            <CardMedia component='video' className={classes.mediaVideo} image={URL + "/public/media/" + repPost.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={repPost.title} />
                                        </>
                                    ) : (
                                        <>
                                            <CardMedia className={classes.media} image={URL + "/public/media/" + repPost.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={repPost.title} />
                                        </>
                                    )

                                )}
                                {repPost.type === 'text' && (
                                    <>
                                        <Typography variant="body2" component="p">{repPost.message}</Typography>
                                    </>
                                )}
                                {repPost.type === 'location' && (
                                    <>
                                        <Map position={repPost.location} height={'50vh'} zoom={10} scrollWheelZoom={false} dragging={false} draggableMarker={false} notPathMap={repPost.location.length <= 2 ? true : false} />
                                    </>
                                )}

                            </CardContent>
                        </ButtonBase>
                    </Card>
                ) : (
                    <Card className={classes.cardReply} raised elevation={8}>
                        <CardContent>
                            <Typography variant="h6"><b>This post was deleted</b></Typography>
                        </CardContent>
                    </Card>
                )}

            </>
        );
    }

    const MyComponent = ({ text }) => {
        const handleClick = () => {
            // Your click event logic here
            console.log('Typography clicked!');
            navigate('/channelPage/' + text);
        };

        return (
            <div style={{ cursor: 'pointer', display: 'inline' }}>
                <Typography style={{ display: 'inline' }} key={text} variant="body1" onClick={handleClick}>
                    ${text}&nbsp;
                </Typography>
            </div >
        );
    };

    return (
        <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
            <div className={classes.card}>
                <div className={classes.section}>
                    <Typography variant="h3" component="h2">{post.title}</Typography>
                    <Typography variant="h6">Created by: {post.name}</Typography>
                    <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
                    {post.destinatari.length > 0 && (
                        <div className={classes.details}>
                            <Typography variant="body1" style={{ color: 'cyan' }} component="h2">{post.destinatari.map((tag) => <MyComponent key={tag} text={tag} />)}</Typography>
                        </div>
                    )}
                    {(post.destinatariPrivati.find((dest) => dest === user?.result?._id) || post.creator === user?.result?._id) && (
                        <div className={classes.details}>
                            <Typography variant="body1" style={{ color: 'cyan' }} component="h2">
                                {
                                    (post.creator === user?.result?._id ? (
                                        post.destinatariPrivati.map((tag) => (users.find((user) => user.value === tag) ? name(tag) : ''))
                                    ) : (
                                        post.destinatariPrivati.map((tag) => (tag === user?.result?._id ? `@${user?.result?.name} ` : ''))
                                    ))

                                }
                            </Typography>
                        </div>
                    )}
                    <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
                    {post.type === 'media' && (
                        post.selectedFile.split('.').pop() === 'mp4' ? (
                            <div className={classes.imageSection}>
                                <CardMedia component='video' className={classes.mediaVideo} controls image={URL + "/public/media/" + post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
                            </div>
                        ) : (
                            <div className={classes.imageSection}>
                                <CardMedia className={classes.media} image={URL + "/public/media/" + post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
                            </div>
                        )
                    )}
                    {post.type === 'text' && (
                        <>
                            <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
                        </>
                    )}
                    {post.type === 'location' && (
                        <>
                            <Map position={post.location} height={'69vh'} zoom={8} scrollWheelZoom={true} dragging={true} draggableMarker={false} notPathMap={post.location.length <= 2 ? true : false} />
                        </>
                    )}
                    <Button size="small" color="primary" disabled={!user?.result || user?.result?.blocked} onClick={handleReply}>
                        <ReplyIcon fontSize="small" /> Reply
                    </Button>
                    {post.reply !== '' && (
                        <PostReply repPost={replyPost} />
                    )}
                    <Divider style={{ margin: '20px 0' }} />
                    <Typography variant="h6" >
                        <VisibilityIcon style={{ display: 'inline-block', verticalAlign: 'middle' }} color="primary" fontSize="medium" />
                        <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>&nbsp;{post.visual}</span>
                    </Typography>
                    <Divider style={{ margin: '20px 0' }} />
                    <CommentSection post={post} />
                    <Divider style={{ margin: '20px 0' }} />
                </div>

            </div>
        </Paper >
    );
}

export default PostDetails;