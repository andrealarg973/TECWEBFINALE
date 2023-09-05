import React, { useState, useEffect } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import useStyles from '../styles';

const UploadFile = ({ sendDataToParent }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const [file, setFile] = useState();
    const [progress, setProgress] = useState(0);
    const [done, setDone] = useState(false);
    const [finalName, setFinalName] = useState('');

    const uploadMedia = (e) => {
        e.preventDefault();

        const config = {
            onUploadProgress: (progressEvent) => {
                const loaded = progressEvent.loaded;
                const total = progressEvent.total;
                const percentage = (loaded / total) * 100;
                setProgress(percentage.toFixed(2));
            },
        };

        const formData = new FormData();

        formData.append('file', file);

        axios.post(`http://192.168.178.116:5000/${user?.result?._id}/uploadMedia`, formData, config)
            .then(res => {
                if (res.status === 200) {
                    sendDataToParent(res.data.filename);
                    setFinalName(res.data.filename);
                    setDone(true);
                }
            })
            .catch(err => console.log(err));
    }


    const Progress = () => {
        return (
            <>
                <progress style={{ height: '30px' }} value={progress} max="100" /><span style={{ position: 'relative', bottom: '7px' }}>&nbsp;{progress}%</span>
            </>
        )
    }

    //<img src={"http://localhost:5000/public/media/1693921729871_64eb72244c0fa009e717f8dd.jpg"} alt="we" />
    // <video src={'http://localhost:5000/public/media/1693922549529_64eb72244c0fa009e717f8dd.mp4'} width="750" height="500" controls />
    return (
        <Container maxWidth="sm">
            <Paper className={classes.paper} elevation={6}>
                <Typography style={{ textAlign: 'center' }} variant="h6">Upload File</Typography>
                <input style={{ marginBottom: '15px' }} type="file" onChange={(e) => setFile(e.target.files[0])} />
                {progress > 0 && (
                    <Progress />
                )}
                {done && (
                    <Typography style={{ textAlign: 'center' }} variant="h6">Done!</Typography>
                )}
                <Button className={classes.buttonSubmit} onClick={uploadMedia} variant="contained" color="primary" size="large" type="submit" fullWidth>Upload</Button>

            </Paper>
        </Container>
    );
}

export default UploadFile;