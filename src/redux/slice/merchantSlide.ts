import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IMerchant } from "../../types/backend";
import { callFetchMerchants } from "../../config/api";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IMerchant[];

}

export const fetchMerchant = createAsyncThunk(
    'merchant/fetchMerchant',
    async ({ query }: { query: string }) => {
        const res = await callFetchMerchants(query);
        return res;
    }
)

const initialState: IState = {
    isFetching: true,
    meta: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: [],
};
export const merchantSlide = createSlice({
    name: 'merchant',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchMerchant.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchMerchant.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchMerchant.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
            // Add user to the state array

            // state.courseOrder = action.payload;
        })

    },
});

export default merchantSlide.reducer;