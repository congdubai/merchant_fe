import type { Action, ThunkAction, } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import merchantReducer from './slice/merchantSlide';
import mccReducer from './slice/mccSlice';
import merchantHistoryReducer from './slice/merchanthistorySlide';
import userReducer from './slice/userSlide';
import permissionReducer from './slice/permissionSlide';
import accountReducer from './slice/accountSlide';
import roleReducer from './slice/roleSlide';
export const store = configureStore({
    reducer: {
        merchant: merchantReducer,
        merchantHistory: merchantHistoryReducer,
        user: userReducer,
        permission: permissionReducer,
        account: accountReducer,
        role: roleReducer,
        mcc: mccReducer
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