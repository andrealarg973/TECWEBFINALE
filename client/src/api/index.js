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

export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const updateVisual = (id) => API.patch(`/posts/${id}/visual`);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const dislikePost = (id) => API.patch(`/posts/${id}/dislikePost`);
export const commentPost = (value, id) => API.post(`/posts/${id}/commentPost`, { value });

export const signIn = (formData) => API.post('/users/signin', formData);
export const signUp = (formData) => API.post('/users/signup', formData);
export const updateQuota = (formData) => API.patch(`/users/updateQuota`, formData);
export const getCar = (id) => API.patch(`/users/caratteri`, id);

export const getChannels = () => API.get('/channels/getChannels');
export const createChannel = (channel) => API.post('/channels/addChannel', channel);