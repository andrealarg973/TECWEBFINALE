import { AUTH, UPDATE_QUOTA, UPDATE_PWD, GET_CAR, GET_USERS, GET_SMMS, GET_MY_SMM, SET_SMM, GET_QUOTA, GET_NOTIFICATIONS, READ_NOTIFICATION, RESET_PWD } from '../constants/actionTypes';
import * as api from '../api';

export const getUsers = (id) => async (dispatch) => {
    try {
        const { data } = await api.getUsers(id);

        dispatch({ type: GET_USERS, payload: data });

        return data;
    } catch (error) {
        console.log(error);
    }
}

export const getSMMs = () => async (dispatch) => {
    try {
        const { data } = await api.getSMMs();
        dispatch({ type: GET_SMMS, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const setSMM = (idVip, idSmm) => async (dispatch) => {
    //console.log('ACTIONS', idVip, idSmm);
    try {
        const { data } = await api.setSMM(idVip, { id: idSmm });
        //console.log('wewe', data);
        dispatch({ type: SET_SMM, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const getMySMM = (id) => async (dispatch) => {
    try {
        const { data } = await api.getMySMM(id);
        //console.log('wewe', data);
        dispatch({ type: GET_MY_SMM, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const signin = (formData, navigate) => async (dispatch) => {
    try {
        // login
        const { data } = await api.signIn(formData);

        dispatch({ type: AUTH, data });

        navigate('/');
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const deleteAccount = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.deleteAccount(formData);

        dispatch({ type: RESET_PWD, data });

        //navigate('/');
    } catch (error) {
        console.log(error);
    }
}

export const resetPwd = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.resetPwd(formData);

        dispatch({ type: RESET_PWD, data });

        navigate('/authReset');
    } catch (error) {
        console.log(error);
    }
}

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        // register
        const { data } = await api.signUp(formData);
        //console.log(data);
        dispatch({ type: AUTH, data });

        navigate('/');
        return data;
    } catch (error) {
        console.log(error);
    }
}


export const updateQuota = (formData) => async (dispatch) => {
    try {
        const { data } = await api.updateQuota(formData);
        //console.log('data', data);
        dispatch({ type: UPDATE_QUOTA, payload: data });

    } catch (error) {
        console.log(error);
    }
}

export const updatePassword = (id, pwd, navigate) => async (dispatch) => {
    try {
        const { data } = await api.updatePassword(id, pwd);
        //console.log('data', data);
        dispatch({ type: UPDATE_PWD, payload: data });
        navigate('/');

    } catch (error) {
        console.log(error);
    }
}

export const getCar = (id) => async (dispatch) => {
    try {
        const { data } = await api.getCar(id);
        //console.log('data', data);
        dispatch({ type: GET_CAR, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }

}

export const getNotifications = (id) => async (dispatch) => {
    try {
        const { data } = await api.getNotifications(id);
        //console.log('data', data);
        dispatch({ type: GET_NOTIFICATIONS, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }

}

export const readNotification = (id) => async (dispatch) => {
    try {
        const { data } = await api.readNotification(id);
        //console.log('data', data);
        dispatch({ type: READ_NOTIFICATION, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }

}

export const getQuotas = (id) => async (dispatch) => {
    try {
        const { data } = await api.getQuotas(id);
        //console.log('data', data);
        dispatch({ type: GET_QUOTA, payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}