import React, { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbDownAltOutlined from '@material-ui/icons/ThumbDownAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
//import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CreateIcon from '@material-ui/icons/Create';
import moment from 'moment';
import Map from '../../Map/Map';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { URL } from '../../../constants/paths';

import { deletePost, likePost, dislikePost, updateVisual, getPost } from '../../../actions/posts';

import useStyles from './styles';


const Post = ({ post, setCurrentId, users }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [likes, setLikes] = useState(post?.likes);
    const [dislikes, setDislikes] = useState(post?.dislikes);
    const [hasReacted, setHasReacted] = useState(false);

    const userId = user?.result?.sub || user?.result?._id;

    const hasLikedPost = post?.likes?.find((like) => like === userId);
    const hasDislikedPost = post?.dislikes?.find((dislike) => dislike === userId);
    /*const [replyPost, setReplyPost] = useState({
        title: '',
        message: '',
        tags: [],
        selectedFile: '',
        privacy: 'public',
        type: 'text',
        reply: '',
        location: [],
        destinatari: [],
        destinatariPrivati: [],
    });*/
    const replyPosts = useSelector((state) => (state.posts.replyPosts ? state.posts.replyPosts : []));
    //const hasReacted = hasLikedPost || hasDislikedPost;



    const handleLike = async () => {
        dispatch(likePost(post._id));
        if (!hasReacted) {
            //console.log('first reaction');
            dispatch(updateVisual(post._id));
            setHasReacted(true);
        }

        if (hasDislikedPost) {
            setDislikes(post.dislikes.filter((id) => id !== userId));
        }

        if (hasLikedPost) {
            setLikes(post.likes.filter((id) => id !== userId));
        } else {
            setLikes([...post.likes, userId]);

        }

    }

    const handleDislike = async () => {
        dispatch(dislikePost(post._id));
        if (!hasReacted) {
            //console.log('first reaction');
            dispatch(updateVisual(post._id));
            setHasReacted(true);
        }

        if (hasLikedPost) {
            setLikes(post.likes.filter((id) => id !== userId));
        }

        if (hasDislikedPost) {
            setDislikes(post.dislikes.filter((id) => id !== userId));
        } else {
            setDislikes([...post.dislikes, userId]);
        }
    }

    const Likes = () => {
        if (likes.length > 0) {
            return likes.find((like) => like === (user?.result?.sub || user?.result?._id))
                ? (
                    <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length}</>
                ) : (
                    <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length}</>
                );
        }

        return <><ThumbUpAltOutlined fontSize="small" /></>;
    };

    const Dislikes = () => {
        if (dislikes.length > 0) {
            return dislikes.find((dislike) => dislike === (user?.result?.sub || user?.result?._id))
                ? (
                    <><ThumbDownAltIcon fontSize='small' />&nbsp;{dislikes.length}</>
                ) : (
                    <><ThumbDownAltOutlined fontSize='small' />&nbsp;{dislikes.length}</>
                );
        }

        return <><ThumbDownAltOutlined fontSize='small' /></>
    }

    const openPost = () => {
        if (!post?.repeat) {
            dispatch(updateVisual(post._id));
            navigate(`/posts/${post._id}`);
        }
    }

    const postReplied = () => {
        dispatch(updateVisual(post.reply));
        navigate(`/posts/${post.reply}`);
        //console.log(post);
    }

    const name = (c) => {
        const foundItem = users.find(item => item.value === c);
        return (foundItem ? '@' + foundItem.label + ' ' : '@' + user?.result?.name);
    }

    const postInfo = (id) => {
        const foundItem = replyPosts.find(item => item._id === id);
        //console.log(foundItem);
        return (foundItem ? foundItem : { name: '', type: 'text', message: '' });
    }

    const PostReply = ({ repPost }) => {
        return (
            <>
                {repPost.name ? (
                    <Card className={classes.cardReply} raised elevation={8}>
                        <ButtonBase className={classes.cardAction} onClick={postReplied}>
                            <div className={classes.details} >
                                <Typography variant="h6">Reply to: {repPost.name}</Typography>
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
                                        <Map position={repPost.location} height={'20vh'} zoom={10} scrollWheelZoom={false} dragging={false} draggableMarker={false} draggableEventHandler={(() => { })} />
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

    // IMG:
    // <CardMedia className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
    // usa classes.overlay per scrivere sopra l'immagine

    return (
        <Card className={classes.card} style={((post.destinatariPrivati.length > 0 && !post.repeat) ? { border: '2px dashed blue' } : (post.repeat ? (post.active ? { border: '3px solid green' } : { border: '3px solid red' }) : {}))} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost}>

                <div className={classes.details} >
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
                </div>
                {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && false && (
                    <div className={classes.overlay2}>
                        <CreateIcon onClick={() => { setCurrentId(post._id) }} fontSize="medium" />
                    </div>
                )}
                {post.destinatari.length > 0 && (
                    <div className={classes.details}>
                        <Typography variant="body1" style={{ color: 'cyan' }} component="h2">{post.destinatari.map((tag) => `$${tag} `)}</Typography>
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


                <div className={classes.details}>
                    <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
                </div>
                <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
                <CardContent>
                    {post.type === 'media' && (
                        post.selectedFile.split('.').pop() === 'mp4' ? (
                            <>
                                <CardMedia component='video' className={classes.mediaVideo} controls image={URL + "/public/media/" + post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
                            </>
                        ) : (
                            <>
                                <CardMedia className={classes.media} image={URL + "/public/media/" + post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
                            </>
                        )

                    )}
                    {post.type === 'text' && (
                        <>
                            <Typography variant="body2" component="p">{post.message}</Typography>
                        </>
                    )}
                    {post.type === 'location' && (
                        <>
                            <Map position={post.location} height={'26vh'} zoom={10} scrollWheelZoom={false} dragging={false} draggableMarker={false} draggableEventHandler={(() => { })} />
                        </>
                    )}

                </CardContent>
            </ButtonBase>
            {post.reply !== '' && (
                <PostReply repPost={postInfo(post.reply)} />
            )}

            <CardActions className={classes.cardActions}>
                {!post.repeat && (
                    <div>
                        <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
                            <Likes />
                        </Button>
                        <Button size="small" color="primary" align="center" disabled={!user?.result} onClick={handleDislike}>
                            <Dislikes />
                        </Button>
                    </div>
                )}
                {!post.repeat ? (
                    <Button size="small" color="primary" disabled={!user?.result} onClick={() => { setCurrentId(post._id) }}>
                        <ReplyIcon fontSize="small" /> Reply
                    </Button>
                ) : (
                    <>
                        <Button size="small" color="primary" onClick={() => { setCurrentId(post._id) }}>
                            <CreateIcon fontSize="small" /> Manage
                        </Button>
                        Timer: {post.repeat} seconds
                    </>
                )}


            </CardActions>
        </Card >
    );
}
//{(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && ()}

export default Post;