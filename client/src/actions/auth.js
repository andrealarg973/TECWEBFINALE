import { AUTH, UPDATE_QUOTA, GET_CAR } from '../constants/actionTypes';
import * as api from '../api';

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
        console.log('data', data);
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