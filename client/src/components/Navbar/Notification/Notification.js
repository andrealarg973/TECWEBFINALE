import * as React from 'react';
import { Typography } from '@material-ui/core';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { readNotification } from '../../../actions/auth';
import './style.css';

export default function MenuListComposition({ windowSize, notifications }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
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
      // update visual
      dispatch(readNotification({ id: id }));
      navigate(`/posts/${found}`);
    }
  }

  const readAll = (e) => {
    notifications.map((not) => dispatch(readNotification({ id: not._id })));
    navigate(`/posts`);
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

  const Notification = ({ notify }) => {
    return (
      <Typography variant="inherit" noWrap>
        {notify.content}
      </Typography>
    );
  }

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
          <NotificationsIcon fontSize='large' />
          {notifications.length > 0 && (
            <div className="iconBadge">{notifications.length}</div>
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
              <Paper sx={{ width: (windowSize > 500 ? '100%' : 280) }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    {notifications.length > 0 ? (
                      <div>
                        {notifications.map((notify) => (
                          <MenuItem key={notify._id} onClick={(e) => handleOpenNotify(e, notify._id)}>
                            <Notification notify={notify} />
                          </MenuItem>
                        ))}
                        <MenuItem onClick={readAll}>
                          Clear All
                        </MenuItem>
                      </div>
                    ) : (
                      <MenuItem onClick={handleClose}>
                        You don't have notifications
                      </MenuItem>
                    )
                    }
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
