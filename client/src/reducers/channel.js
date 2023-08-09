import { CREATE_CHANNEL, GET_CHANNELS, GET_MY_CHANNELS, UPDATE_CHANNEL } from '../constants/actionTypes';

const channelReducers = (state = { channels: [] }, action) => {
    switch (action.type) {
        case GET_CHANNELS:
        case GET_MY_CHANNELS:
            //console.log('STATE', state);
            return action.payload;
        case CREATE_CHANNEL:
        case UPDATE_CHANNEL:
            //console.log('QUI');
            return { ...state, channels: [...state.channels, action.payload] };
        default:
            return state.channels;
    }
}

export default channelReducers;