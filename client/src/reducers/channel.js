import { CREATE_CHANNEL, GET_CHANNELS } from '../constants/actionTypes';

const channelReducers = (state = { channels: [] }, action) => {
    switch (action.type) {
        case GET_CHANNELS:
            //console.log('STATE', state);
            return action.payload;
        case CREATE_CHANNEL:
            //console.log('QUI');
            return { ...state, channels: [...state.channels, action.payload] };
        default:
            return state.channels;
    }
}

export default channelReducers;