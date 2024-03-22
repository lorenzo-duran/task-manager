/* eslint-disable @typescript-eslint/ban-ts-comment */
import { api } from "@/api";
import auth from "@/features/auth/authSlice";
import {
  combineReducers,
  configureStore,
  isRejectedWithValue,
  type ConfigureStoreOptions,
  type Middleware,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  type PersistConfig,
} from "redux-persist";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage/session";

export const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: ["auth"],
  version: 1,
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);

const ignoredActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

const rtkQueryErrorLoggerForMutations: Middleware =
  () => (next) => (action) => {
    // @ts-ignore
    if (isRejectedWithValue(action) && action.meta.arg?.type === "mutation") {
      let errorMessage = "Request failed";

      // @ts-ignore There is no type definition provided for this action
      if (action?.payload?.data?.message) {
        // @ts-ignore
        errorMessage = action.payload.data.message;
      }

      toast(errorMessage, {
        type: "error",
      });
    }

    return next(action);
  };

export const createStore = (
  options?: ConfigureStoreOptions["preloadedState"] | undefined
) =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions,
        },
      })
        .concat(api.middleware)
        .concat(rtkQueryErrorLoggerForMutations),
    ...options,
  });

export const store = createStore();
export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
