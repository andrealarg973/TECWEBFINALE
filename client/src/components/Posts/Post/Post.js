import React, { useState } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbDownAltOutlined from '@material-ui/icons/ThumbDownAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
//import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CreateIcon from '@material-ui/icons/Create';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { deletePost, likePost, dislikePost, updateVisual } from '../../../actions/posts';

import useStyles from './styles';
const Post = ({ post, setCurrentId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [likes, setLikes] = useState(post?.likes);
    const [dislikes, setDislikes] = useState(post?.dislikes);

    const userId = user?.result?.sub || user?.result?._id;
    const hasLikedPost = post?.likes?.find((like) => like === userId);
    const hasDislikedPost = post?.dislikes?.find((dislike) => dislike === userId);


    const handleLike = async () => {
        dispatch(likePost(post._id));

        if (hasLikedPost) {
            setLikes(post.likes.filter((id) => id !== userId));
        } else {
            setLikes([...post.likes, userId]);
        }

    }

    const handleDislike = async () => {
        dispatch(dislikePost(post._id));

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
        dispatch(updateVisual(post._id));
        navigate(`/posts/${post._id}`);
    }

    return (
        <Card className={classes.card} raised elevation={6}>
            <ButtonBase className={classes.cardAction} onClick={openPost}>
                <CardMedia className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
                <div className={classes.overlay}>
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
                </div>
            </ButtonBase>
            {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && (
                <div className={classes.overlay2}>
                    <CreateIcon onClick={() => { setCurrentId(post._id) }} fontSize="medium" />
                </div>
            )}
            <ButtonBase className={classes.cardAction} onClick={openPost}>

                <div className={classes.details}>
                    <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
                </div>
                <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
                </CardContent>
            </ButtonBase>
            <CardActions className={classes.cardActions}>
                <div>
                    <Button size="small" color="primary" disabled={!user?.result} onClick={handleLike}>
                        <Likes />
                    </Button>
                    <Button size="small" color="primary" align="center" disabled={!user?.result} onClick={handleDislike}>
                        <Dislikes />
                    </Button>
                </div>
                {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && (
                    <Button size="small" color="secondary" onClick={() => { dispatch(deletePost(post._id)) }}>
                        <DeleteIcon fontSize="small" /> Delete
                    </Button>
                )}

            </CardActions>
        </Card >
    );
}

export default Post;