import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage on init
const storedTokens = localStorage.getItem('tokens');
const storedUser = localStorage.getItem('user');

const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    tokens: storedTokens ? JSON.parse(storedTokens) : null,
    isAuthenticated: !!storedTokens,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, tokens } = action.payload;
            state.user = user;
            state.tokens = tokens;
            state.isAuthenticated = true;
            localStorage.setItem('tokens', JSON.stringify(tokens));
            localStorage.setItem('user', JSON.stringify(user));
        },
        updateTokens: (state, action) => {
            state.tokens = { ...state.tokens, ...action.payload };
            localStorage.setItem('tokens', JSON.stringify(state.tokens));
        },
        logout: (state) => {
            state.user = null;
            state.tokens = null;
            state.isAuthenticated = false;
            localStorage.removeItem('tokens');
            localStorage.removeItem('user');
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(state.user));
        },
    },
});

export const { setCredentials, updateTokens, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
