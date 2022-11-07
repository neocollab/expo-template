import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from './user-slice';
import { productsApi } from 'src/services/product-queries';

const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
};

const reducers = combineReducers({
    user: userReducer,
    [productsApi.reducerPath]: productsApi.reducer,
});

const persistedReducers = persistReducer(persistConfig, reducers);
/*
  Usage with redux persist: https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
  Helpful tutorial: https://edvins.io/how-to-use-redux-persist-with-redux-toolkit 
*/

export const store = configureStore({
    reducer: persistedReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(productsApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
