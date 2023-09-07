import React, { useEffect, useState } from 'react';
import { Paper, Typography, Grow, Button, CircularProgress, Divider, CardMedia, Card, ButtonBase, CardContent } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { getChannelByName, getPublicChannels } from '../../actions/channels';
import { getChannelPosts } from '../../actions/posts';
import { updateChannel } from '../../actions/channels';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useStyles from './styles';

import Posts from '../Posts/Posts';

const ChannelPage = () => {
    const dispatch = useDispatch();
    //const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const { id } = useParams();
    const classes = useStyles();
    const [currentId, setCurrentId] = useState(0);
    const [channel, setChannel] = useState({
        privacy: '',
        value: '',
        label: '',
        desc: '',
        owner: [],
        write: [],
        read: [],
    });
    const [allowed, setAllowed] = useState(true);

    const getChannel = async () => {
        await dispatch(getChannelByName(id)).then((res) => {
            if (!res) return;
            const allow = (res.owner.find((u) => u === user?.result?._id) ||
                res.write.find((u) => u === user?.result?._id) ||
                res.read.find((u) => u === user?.result?._id) ||
                res.privacy === 'reserved' ||
                res.privacy === 'public');
            setChannel(res);
            setAllowed(allow);
            //console.log(res);
        });
    }

    const allowedToReadChannel = () => {
        return (
            channel.owner.find((u) => u === user?.result?._id) ||
            channel.write.find((u) => u === user?.result?._id) ||
            channel.read.find((u) => u === user?.result?._id) ||
            channel.privacy === 'reserved' ||
            channel.privacy === 'public'
        );
    }

    const handleSubscription = async (e) => {
        e.preventDefault();

        if (channel.read.find((u) => u === user?.result?._id) || channel.write.find((u) => u === user?.result?._id)) {
            // unsub
            dispatch(updateChannel(channel?._id, { ...channel, read: channel.read.filter((u) => u !== user?.result?._id), write: channel.write.filter((u) => u !== user?.result?._id) }));
            setChannel({ ...channel, read: channel.read.filter((u) => u !== user?.result?._id), write: channel.write.filter((u) => u !== user?.result?._id) });
            toast("Unubscribed!", { type: "warning" });
        } else {
            // sub
            dispatch(updateChannel(channel?._id, { ...channel, read: channel.read.concat([user?.result?._id]) }));
            setChannel({ ...channel, read: channel.read.concat([user?.result?._id]) });
            toast("Subscribed!", { type: "success" });
        }
    }

    useEffect(() => {
        if (user) {
            getChannel();
            //console.log(channel);
            if (allowed) dispatch(getChannelPosts(id));
        }


    }, [allowed]);

    return (
        <>
            {allowed && channel.label !== '' ? (
                <>
                    <Card className={classes.card} raised elevation={6}>
                        <div className={classes.details}>
                            <Typography style={{ color: 'cyan' }} variant="h4">{channel.label}</Typography>
                            <div className={classes.descSubscribe}>
                                <Typography style={{ marginRight: '40px' }} variant="h6">{channel.desc}</Typography>
                                {!channel.owner.find((u) => u === user?.result?._id) && channel.privacy !== 'reserved' && (
                                    ((channel.read.find((u) => u === user?.result?._id) || channel.write.find((u) => u === user?.result?._id)) ? (
                                        <Button className={classes.buttonSubmit} variant="contained" color="secondary" size="large" type="submit" onClick={handleSubscription}>Unsubscribe</Button>
                                    ) : (
                                        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" onClick={handleSubscription}>Subscribe</Button>
                                    ))
                                )}
                            </div>
                        </div>
                    </Card>

                    <Grow in>
                        <Posts setCurrentId={setCurrentId} fullScreen={true} />
                    </Grow >
                </>
            ) : (
                <>
                    <Typography variant="h4">Not allowed to see posts in this channel Or channel not found</Typography>
                </>
            )}
        </>
    );
}

export default ChannelPage;