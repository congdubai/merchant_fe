import type { Action, ThunkAction, } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import merchantReducer from './slice/merchantSlide';
import mccReducer from './slice/mccSlice'; 

export const store = configureStore({
    reducer: {
        merchant: merchantReducer,
        mcc: mccReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;