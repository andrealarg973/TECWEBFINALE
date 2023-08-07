import { AUTH, LOGOUT, UPDATE_QUOTA, GET_CAR, GET_USERS } from '../constants/actionTypes';

const authReducers = (state = { authData: null }, action) => {
    switch (action.type) {
        case AUTH:
            //console.log(action.data);
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action.data };
        case LOGOUT:
            localStorage.clear();
            return { ...state, authData: null };
        case UPDATE_QUOTA:
            return { ...state, authData: action.data };
        case GET_CAR:
            //console.log('REDU', action.payload);
            return action.payload;
        case GET_USERS:
            //console.log('REDU', action.payload);
            return action.payload;
        default:
            return state;
    }
}

export default authReducers;