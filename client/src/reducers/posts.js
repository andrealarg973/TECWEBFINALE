import { START_LOADING, STOP_LOADING, FETCH_ALL, FETCH_UNLOGGED, FETCH_TEMPORAL, FETCH_BY_SEARCH, FETCH_BY_USER, FETCH_POST, FETCH_REPLY_POST, CREATE, CREATE_TEMPORAL, UPDATE, UPDATE_TEMPORAL, DELETE, LIKE, COMMENT } from '../constants/actionTypes';

const postReducers = (state = { isLoading: true, posts: [] }, action) => {
    switch (action.type) {
        case START_LOADING:
            return { ...state, isLoading: true };
        case STOP_LOADING:
            return { ...state, isLoading: false };
        case FETCH_ALL:
        case FETCH_UNLOGGED:
            return {
                ...state,
                replyPosts: action.payload.replyPosts,
                posts: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages,
            };
        case FETCH_TEMPORAL:
            return {
                ...state,
                replyPosts: action.payload.replyPosts,
                posts: action.payload.data,
                currentPage: action.payload.currentPage,
                numberOfPages: action.payload.numberOfPages,
            };
        case FETCH_BY_SEARCH:
            return { ...state, posts: action.payload.data, replyPosts: action.payload.replyPosts };
        case FETCH_BY_USER:
            return { ...state, posts: action.payload.data, replyPosts: action.payload.replyPosts };
        case FETCH_POST:
            return { ...state, post: action.payload.data, replyPost: action.payload.replyPost };
        case FETCH_REPLY_POST:
            return { ...state, replyPost: action.payload };
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
        case UPDATE_TEMPORAL:
            return { ...state, posts: state.posts.map((post) => (post._id === action.payload._id ? action.payload : post)) };
        case DELETE:
            return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
        default:
            return state;
    }
};

export default postReducers;