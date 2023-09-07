import { GET_CHANNELS, GET_RES_CHANNELS, GET_MY_CHANNELS, CREATE_CHANNEL, UPDATE_CHANNEL } from '../constants/actionTypes';
import * as api from '../api';

export const getOwnedChannels = (id) => async (dispatch) => {
    //console.log(id);
    try {
        const { data } = await api.getOwnedChannels(id);
        //console.log(data);
        dispatch({ type: GET_CHANNELS, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}
export const getWritableChannels = (id) => async (dispatch) => {
    //console.log(id);
    try {
        const { data } = await api.getWritableChannels(id);
        //console.log(data);
        dispatch({ type: GET_CHANNELS, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}
export const getReadableChannels = (id) => async (dispatch) => {
    //console.log(id);
    try {
        const { data } = await api.getReadableChannels(id);
        //console.log(data);
        dispatch({ type: GET_CHANNELS, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}
export const getChannels = (id) => async (dispatch) => {
    //console.log(id);
    try {
        const { data } = await api.getChannels(id);
        //console.log(data);
        dispatch({ type: GET_CHANNELS, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const getReservedChannels = () => async (dispatch) => {
    try {
        const { data } = await api.getReservedChannels();
        //console.log(data);
        dispatch({ type: GET_RES_CHANNELS, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const getMyChannels = (id) => async (dispatch) => {
    //console.log(id);
    try {
        const { data } = await api.getMyChannels(id);
        //console.log(data);
        dispatch({ type: GET_MY_CHANNELS, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const createChannel = (channel) => async (dispatch) => {
    try {
        const { data } = await api.createChannel(channel);
        dispatch({ type: CREATE_CHANNEL, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const updateChannel = (id, channel) => async (dispatch) => {
    try {
        const { data } = await api.updateChannel(id, channel);
        dispatch({ type: UPDATE_CHANNEL, payload: data });
    } catch (error) {
        console.log(error);
    }
}