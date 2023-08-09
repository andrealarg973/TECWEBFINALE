import { AUTH, LOGOUT, UPDATE_QUOTA, GET_CAR, GET_USERS, GET_SMMS, SET_SMM, GET_MY_SMM } from '../constants/actionTypes';

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
        case GET_USERS:
        case GET_SMMS:
        case SET_SMM:
        case GET_MY_SMM:
            return action.payload;
        default:
            return state;
    }
}

export default authReducers;