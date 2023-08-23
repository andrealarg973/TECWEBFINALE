import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

//const url = 'http://localhost:5000/posts'; // url pointing to backend

// what happens before all requests (header to know that user is logged in)
API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.Authorization = 'Bearer ' + JSON.parse(localStorage.getItem('profile')).token;
    }
    return req;
});

export const fetchPosts = (page, userId) => API.get(`/posts/${userId}/all?page=${page}`, userId);
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPostsByUser = (id) => API.get(`/posts/${id}/posts`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}&channel=${searchQuery.channel}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const createPostTemporal = (newPost) => API.post('/posts/automatic', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const updateVisual = (id) => API.patch(`/posts/${id}/visual`);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const dislikePost = (id) => API.patch(`/posts/${id}/dislikePost`);
export const commentPost = (value, id) => API.post(`/posts/${id}/commentPost`, { value });

export const getQuotas = (id) => API.get(`/users/${id}/getQuotas`);
export const getUsers = (id) => API.get(`/users/${id}/getUsers`);
export const getSMMs = () => API.get(`/users/getSMM`);
export const getMySMM = (id) => API.get(`/users/${id}/getSMM`);
export const signIn = (formData) => API.post('/users/signin', formData);
export const signUp = (formData) => API.post('/users/signup', formData);
export const updateQuota = (formData) => API.patch(`/users/updateQuota`, formData);
export const getCar = (id) => API.patch(`/users/caratteri`, id);
export const setSMM = (idVip, idSmm) => API.patch(`/users/${idVip}/setSMM`, idSmm);

export const getChannels = (id) => API.get(`/channels/${id}/getChannels`);
export const getMyChannels = (id) => API.get(`/channels/${id}/getMyChannels`);
export const createChannel = (channel) => API.post('/channels/addChannel', channel);
export const updateChannel = (id, channel) => API.patch(`/channels/${id}/updateChannel`, channel);
