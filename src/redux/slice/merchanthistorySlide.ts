import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IMerchantHistory } from "../../types/backend";
import { callFetchMerchants, callFetchMerchantsHistory, callSearchMerchants } from "../../config/api";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: IMerchantHistory[];

}

export const fetchMerchantHistory = createAsyncThunk(
    'merchant/fetchMerchant',
    async ({ query }: { query: string }) => {
        const res = await callFetchMerchantsHistory(query);
        return res;
    }
)

export const searchhMerchantHistory = createAsyncThunk(
    'merchant/searchMerchant',
    async ({ query }: { query: string }) => {
        const res = await callFetchMerchantsHistory(query);
        return res;
    }
)
const initialState: IState = {
    isFetching: true,
    meta: {
        page: 1,
        pageSize: 5,
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
        builder.addCase(fetchMerchantHistory.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchMerchantHistory.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(fetchMerchantHistory.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
            // Add user to the state array

            // state.courseOrder = action.payload;
        })

        builder.addCase(searchhMerchantHistory.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(searchhMerchantHistory.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        })

        builder.addCase(searchhMerchantHistory.fulfilled, (state, action) => {
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