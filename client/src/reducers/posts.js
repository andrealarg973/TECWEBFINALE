import { START_LOADING, STOP_LOADING, FETCH_ALL, FETCH_BY_SEARCH, FETCH_BY_USER, FETCH_POST, FETCH_REPLY_POST, CREATE, CREATE_TEMPORAL, UPDATE, DELETE, LIKE, COMMENT } from '../constants/actionTypes';

const postReducers = (state = { isLoading: true, posts: [] }, action) => {
    switch (action.type) {
        case START_LOADING:
            return { ...state, isLoading: true };
        case STOP_LOADING:
            return { ...state, isLoading: false };
        case FETCH_ALL:
            return {
                ...state,
                posts: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages,
            };
        case FETCH_BY_SEARCH:
            return { ...state, posts: action.payload.data };
        case FETCH_BY_USER:
            return { ...state, posts: action.payload.data };
        case FETCH_POST:
            return { ...state, post: action.payload };
        case FETCH_REPLY_POST:
            return action.payload;
        case LIKE:
            return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };
        case COMMENT:
            return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };
        case CREATE:
            return { ...state, posts: [...state.posts, action.payload] };
        case CREATE_TEMPORAL:
            return state;
        case UPDATE:
            return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };
        case DELETE:
            return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
        default:
            return state;
    }
};

export default postReducers;