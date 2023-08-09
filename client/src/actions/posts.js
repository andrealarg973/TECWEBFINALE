import { FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH, FETCH_BY_USER, CREATE, UPDATE, DELETE, START_LOADING, STOP_LOADING, COMMENT } from '../constants/actionTypes';
import * as api from '../api';

// Action Creators (functions that return an action)

export const getPost = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchPost(id);

        //console.log(data);

        dispatch({ type: FETCH_POST, payload: data });
        dispatch({ type: STOP_LOADING });
    } catch (error) {
        console.log(error.message);
    }
}

export const getPosts = (page, userId) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchPosts(page, userId);

        //console.log(data);

        dispatch({ type: FETCH_ALL, payload: data });
        dispatch({ type: STOP_LOADING });
    } catch (error) {
        console.log(error.message);
    }
}

export const getPostsBySearch = (searchQuery) => async (dispatch) => {

    try {
        dispatch({ type: START_LOADING });
        const { data: { data } } = await api.fetchPostsBySearch(searchQuery);
        //console.log("ACTIONS");

        dispatch({ type: FETCH_BY_SEARCH, payload: { data } });
        dispatch({ type: STOP_LOADING });
    } catch (error) {
        console.log(error);
    }
}

export const getPostsByUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data: { data } } = await api.fetchPostsByUser(id);
        //console.log('data', data);

        dispatch({ type: FETCH_BY_USER, payload: { data } });
        dispatch({ type: STOP_LOADING });
    } catch (error) {
        console.log(error);
    }
}


export const createPost = (post) => async (dispatch) => {
    try {
        const { data } = await api.createPost(post);

        dispatch({ type: CREATE, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const updatePost = (id, post) => async (dispatch) => {
    try {
        const { data } = await api.updatePost(id, post);
        dispatch({ type: UPDATE, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const updateVisual = (id) => async (dispatch) => {
    try {
        const { data } = await api.updateVisual(id);
        dispatch({ type: UPDATE, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = (id) => async (dispatch) => {
    try {
        await api.deletePost(id);
        dispatch({ type: DELETE, payload: id });
    } catch (error) {
        console.log(error);
    }
}

export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.likePost(id);
        dispatch({ type: UPDATE, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const dislikePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.dislikePost(id);
        dispatch({ type: UPDATE, payload: data });
    } catch (error) {
        console.log(error);
    }
}

export const commentPost = (value, id) => async (dispatch) => {
    try {
        const { data } = await api.commentPost(value, id);
        dispatch({ type: COMMENT, payload: data });

        return data.comments;
    } catch (error) {
        console.log(error);
    }
}