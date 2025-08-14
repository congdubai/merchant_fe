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
        return res.data; 
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
            if (action.payload) { 
                state.isFetching = false;
                state.meta = action.payload.meta;
                state.result = action.payload.result;
            }
        });
    }
});

export default mccSlice.reducer;
