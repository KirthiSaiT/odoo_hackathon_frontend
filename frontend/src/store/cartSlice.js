import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        openCart: (state) => {
            state.isOpen = true;
        },
        closeCart: (state) => {
            state.isOpen = false;
        },
        clearCart: (state) => {
            // If we are using RTK Query, this might just trigger a refetch or optimistic update
            // For now, it can be a placeholder or handle UI state
        }
    },
});

export const { toggleCart, openCart, closeCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
