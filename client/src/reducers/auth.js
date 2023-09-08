import { AUTH, LOGOUT, RESET_PWD, UPDATE_QUOTA, UPDATE_PWD, GET_CAR, GET_USERS, GET_SMMS, SET_SMM, GET_MY_SMM, GET_QUOTA, GET_NOTIFICATIONS, READ_NOTIFICATION } from '../constants/actionTypes';

const authReducers = (state = { authData: null, notifications: [] }, action) => {
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
        case GET_NOTIFICATIONS:
            //console.log(action.payload);
            return { ...state, notifications: action.payload };
        //return { ...state, notifications: state.notifications.filter((not) => not._id !== action.payload) };
        case GET_CAR:
        case GET_USERS:
        case GET_SMMS:
        case SET_SMM:
        case GET_MY_SMM:
        case GET_QUOTA:
        case READ_NOTIFICATION:
        case UPDATE_PWD:
            return action.payload;
        case RESET_PWD:
            return state;
        default:
            return state;
    }
}

export default authReducers;