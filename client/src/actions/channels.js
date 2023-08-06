import { GET_CHANNELS } from '../constants/actionTypes';
import * as api from '../api';

export const getChannels = () => async (dispatch) => {
    try {
        const { data } = await api.getChannels();
        //console.log(data);
        dispatch({ type: GET_CHANNELS, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}