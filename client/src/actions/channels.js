import { GET_CHANNELS, CREATE_CHANNEL } from '../constants/actionTypes';
import * as api from '../api';

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

export const createChannel = (channel) => async (dispatch) => {
    try {
        const { data } = await api.createChannel(channel);
        dispatch({ type: CREATE_CHANNEL, payload: data });
    } catch (error) {
        console.log(error);
    }
}