import { AUTH, UPDATE_QUOTA, GET_CAR, GET_USERS, GET_SMMS, GET_MY_SMM, SET_SMM } from '../constants/actionTypes';
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