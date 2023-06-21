import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [],
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        cartUser: (state, action) => {
            state.value = action.payload;
        },
        resetCart: (state, action) => {
            state.value = [];
        },
    },
});

export const { cartUser, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
