import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        id: null,
        email: "",
        name: "",
        is_verified: 0,
        role: 1,
        photo_profile: "",
    },
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.id = action.payload.id;
            state.value.email = action.payload.email;
            state.value.name = action.payload.name;
            state.value.is_verified = action.payload.is_verified;
            state.value.role = action.payload.role;
            state.value.photo_profile = action.payload.photo_profile;
        },
        logout: (state) => {
            state.value.id = null;
            state.value.email = null;
            state.value.name = null;
            state.value.is_verified = null;
            state.value.role = null;
            state.value.photo_profile = null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
