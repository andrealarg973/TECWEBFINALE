import axios from 'axios';
import { URL1 } from '../constants/paths';

// http://192.168.178.116:5000
const API = axios.create({ baseURL: URL1 });

//const url = 'http://localhost:5000/posts'; // url pointing to backend

// what happens before all requests (header to know that user is logged in)
API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = 'Bearer ' + JSON.parse(localStorage.getItem('profile')).token;
    }
    return req;
});

export const fetchPosts = (page, userId) => API.get(`/posts/${userId}/all?page=${page}`, userId);
export const fetchUnloggedPosts = (page) => API.get(`/posts/unlogged?page=${page}`);
export const fetchTemporalPosts = (userId) => API.get(`/posts/${userId}/temporal`);
export const fetchChannelPosts = (id) => API.get(`/posts/${id}/getChannelPosts`);
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchReplyPost = (id) => API.get(`/posts/getReplyPost`, id);
export const fetchPostsByUser = (id) => API.get(`/posts/${id}/posts`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}&channel=${searchQuery.channel}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const createPostTemporal = (newPost) => API.post('/posts/automatic', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const updateTemporal = (id, updatedPost) => API.patch(`/posts/${id}/updateTemporal`, updatedPost);
export const updateVisual = (id) => API.patch(`/posts/${id}/visual`);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const dislikePost = (id) => API.patch(`/posts/${id}/dislikePost`);
export const commentPost = (value, id) => API.post(`/posts/${id}/commentPost`, { value });

export const getQuotas = (id) => API.get(`/users/${id}/getQuotas`);
export const getUsers = (id) => API.get(`/users/${id}/getUsers`);
export const getSMMs = () => API.get(`/users/getSMM`);
export const getMySMM = (id) => API.get(`/users/${id}/getSMM`);
export const getNotifications = (id) => API.get(`/users/${id}/getNotifications`);
export const readNotification = (id) => API.patch(`/users/readNotification`, id);
export const updatePassword = (id, pwd) => API.patch(`/users/${id}/changePassword`, pwd);
export const signIn = (formData) => API.post('/users/signin', formData);
export const signUp = (formData) => API.post('/users/signup', formData);
export const updateQuota = (formData) => API.patch(`/users/updateQuota`, formData);
export const getCar = (id) => API.patch(`/users/caratteri`, id);
export const setSMM = (idVip, idSmm) => API.patch(`/users/${idVip}/setSMM`, idSmm);

export const getChannels = (id) => API.get(`/channels/${id}/getChannels`);
export const getChannelByName = (id) => API.get(`/channels/${id}/getChannelByName`);
export const getPublicChannels = (id) => API.get(`/channels/${id}/getPublicChannels`);
export const getOwnedChannels = (id) => API.get(`/channels/${id}/getOwnedChannels`);
export const getWritableChannels = (id) => API.get(`/channels/${id}/getWritableChannels`);
export const getReadableChannels = (id) => API.get(`/channels/${id}/getReadableChannels`);
export const getReservedChannels = () => API.get(`/channels/getReservedChannels`);
export const getMyChannels = (id) => API.get(`/channels/${id}/getMyChannels`);
export const createChannel = (channel) => API.post('/channels/addChannel', channel);
export const updateChannel = (id, channel) => API.patch(`/channels/${id}/updateChannel`, channel);
