import { GET_CHANNELS } from '../constants/actionTypes';

const channelReducer = (state = { channels: [] }, action) => {
    switch (action.type) {
        case GET_CHANNELS:
            console.log('STATE', state);
            return action.payload;
        default:
            return state.channels;
    }
}

export default channelReducer;