import React, { useState } from 'react';
import { Typography, Avatar } from '@material-ui/core';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PersonIcon from '@mui/icons-material/Person';
import AbcIcon from '@mui/icons-material/Abc';
import GroupIcon from '@mui/icons-material/Group';
import CreateIcon from '@mui/icons-material/Create';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { readNotification } from '../../../actions/auth';
import { updateVisual } from '../../../actions/posts';
import './style.css';
import useStyles from '../styles';

export default function MenuListComposition({ windowSize, notifications }) {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //const notifications = useSelector((state) => state.auth.notifications ? state.auth.notifications : []);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleOpenNotify = (e, id) => {
        const found = notifications.find((not) => not._id === id).postId;
        if (found) {
            setOpen(false);
            dispatch(updateVisual(found));
            dispatch(readNotification({ id: id }));
            navigate(`/posts/${found}`);
        }
    }

    const navigateChannelManager = () => {
        setOpen(false);
        navigate('/channelManager');
    }
    const navigateTemporalManager = () => {
        setOpen(false);
        navigate('/temporalPosts');
    }
    const navigateAccountSettings = () => {
        setOpen(false);
        navigate('/settings');
    }

    const navigateBuyQuota = () => {
        setOpen(false);
        navigate('/buyQuota');
    }

    const navigateUserPage = () => {
        setOpen(false);
        navigate('/profile');
    }

    const navigateSelectSMM = () => {
        setOpen(false);
        navigate('/selectSMM');
    }

    const navigateNewSqueal = () => {
        setOpen(false);
        navigate('/newPost');
    }

    const navigateChannelsList = () => {
        setOpen(false);
        navigate('/channelsList');
    }

    const navigateSMMPage = () => {
        setOpen(false);
        //navigate(-2);
        navigate('../../../vue');
    }

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <Stack direction="row" spacing={2}>
            <div style={{ zIndex: '1000' }}>
                <Button
                    ref={anchorRef}
                    id="composition-button"
                    aria-controls={open ? 'composition-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                >
                    <Avatar className={classes.purple} alt={user.result.name} src={user.result.picture} style={{ cursor: "pointer" }} >{user.result.name.charAt(0)}</Avatar>
                    {window.innerWidth > 430 && (
                        <Typography className={classes.username} variant="h6" style={{ cursor: "pointer" }} >{user.result.name}</Typography>
                    )}

                </Button>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    placement="bottom-start"
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                            }}
                        >
                            <Paper sx={{ width: (windowSize > 500 ? '100%' : 280), maxHeight: '400px', overflow: 'auto' }}>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList
                                        autoFocusItem={open}
                                        id="composition-menu"
                                        aria-labelledby="composition-button"
                                        onKeyDown={handleListKeyDown}
                                    >
                                        <MenuItem onClick={navigateUserPage}>
                                            <PersonIcon style={{ color: 'blue' }} />
                                            <div>My Posts</div>
                                        </MenuItem>
                                        {user.result.role === 'smm' && (
                                            <MenuItem onClick={navigateSMMPage}>
                                                <AnalyticsIcon style={{ color: 'blue' }} />
                                                <div>SMM Dashboard</div>
                                            </MenuItem>
                                        )}
                                        <MenuItem onClick={navigateNewSqueal}>
                                            <CreateIcon style={{ color: 'darkgreen' }} />
                                            <div>New Squeal</div>
                                        </MenuItem>
                                        <MenuItem onClick={navigateChannelsList}>
                                            <FormatListBulletedIcon style={{ color: 'green' }} />
                                            <div>Channels list</div>
                                        </MenuItem>
                                        <MenuItem onClick={navigateChannelManager}>
                                            <NoteAddIcon style={{ color: 'green' }} />
                                            <div>Manage Channels</div>
                                        </MenuItem>
                                        <MenuItem onClick={navigateTemporalManager}>
                                            <EditCalendarIcon style={{ color: 'green' }} />
                                            <div>Manage Temporal Posts</div>
                                        </MenuItem>
                                        {user.result.role === 'vip' && (
                                            <MenuItem onClick={navigateSelectSMM}>
                                                <GroupIcon style={{ color: 'green' }} />
                                                <div>Select SMM</div>
                                            </MenuItem>
                                        )}
                                        <MenuItem onClick={navigateBuyQuota}>
                                            <AbcIcon style={{ color: 'green' }} />
                                            <div>Buy Quota</div>
                                        </MenuItem>
                                        <MenuItem onClick={navigateAccountSettings}>
                                            <SettingsIcon style={{ color: 'gray' }} />
                                            <div>Settings</div>
                                        </MenuItem>


                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </Stack >
    );
}
