import React, { useState } from "react";
import { Container } from '@material-ui/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import PostDetails from "./components/PostDetails/PostDetails";
import UserPage from "./components/UserPage/UserPage";
import IncreaseQuota from "./components/IncreaseQuota/IncreaseQuota";
import SelectSmm from "./components/SelectSMM/SelectSmm";
import ChannelManager from "./components/manageChannel/ChannelManager";
import Settings from './components/Settings/Settings';
import TemporalPosts from './components/TemporalPosts/TemporalPosts';
import Form from "./components/Form/Form";
import UploadFile from "./components/UploadFile/UploadFile";
import ChannelList from "./components/ChannelList/ChannelList";
import ChannelPage from "./components/ChannelPage/ChannelPage";

const App = () => {
    const [currentId, setCurrentId] = useState(0);

    return (
        <BrowserRouter>
            <Container maxWidth="xl">
                <Navbar />
                <Routes>
                    <Route path="/" exact element={<Navigate to="/posts" />} />
                    <Route path="/posts" exact element={<Home />} />
                    <Route path="/posts/search" exact element={<Home />} />
                    <Route path="/posts/:id" element={<PostDetails />} />
                    <Route path="/auth" exact element={<Auth />} />
                    <Route path="/authReset" exact element={<><h1>Password resetted! Check your e-mail</h1><Auth /></>} />
                    <Route path="/profile" exact element={<UserPage />} />
                    <Route path="/buyQuota" exact element={<IncreaseQuota />} />
                    <Route path="/selectSMM" exact element={<SelectSmm />} />
                    <Route path="/channelManager" exact element={<ChannelManager />} />
                    <Route path="/settings" exact element={<Settings />} />
                    <Route path="/temporalPosts" exact element={<TemporalPosts />} />
                    <Route path="/uploadFile" exact element={<UploadFile />} />
                    <Route path="/channelsList" exact element={<ChannelList />} />
                    <Route path="/channelPage/:id" exact element={<ChannelPage />} />
                    <Route path="/newPost" exact element={<Form currentId={currentId} setCurrentId={setCurrentId} />} />
                </Routes>
            </Container>
        </BrowserRouter>
    );
}

export default App;