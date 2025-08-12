import type { Action, ThunkAction, } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import merchantReducer from './slice/merchantSlide';

export const store = configureStore({
    reducer: {
        merchant: merchantReducer,
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