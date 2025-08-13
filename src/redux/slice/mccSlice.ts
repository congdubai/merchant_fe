import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IMcc } from "../../types/backend";
import { callFetchMccs } from "../../config/api";

interface IState {
    isFetching: boolean;
    meta: {
        page: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: IMcc[];
}

export const fetchMcc = createAsyncThunk(
    "mcc/fetchMcc",
    async ({ query }: { query: string }) => {
        const res = await callFetchMccs(query);
        return res; // `res` là toàn bộ cấu trúc JSON lồng nhau
    }
);

const initialState: IState = {
    isFetching: true,
    meta: {
        page: 1,
        pageSize: 10,
        pages: 0,
        total: 0
    },
    result: []
};

export const mccSlice = createSlice({ 
    name: "mcc",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchMcc.pending, (state) => {
            state.isFetching = true;
        });

        builder.addCase(fetchMcc.rejected, (state) => {
            state.isFetching = false;
        });

       builder.addCase(fetchMcc.fulfilled, (state, action) => {
            if (action.payload?.data?.data) { 
                const actualData = action.payload.data.data;
                state.isFetching = false;
                state.meta = actualData.meta;
                state.result = actualData.result;
            }
        });
    }
});

export default mccSlice.reducer;
