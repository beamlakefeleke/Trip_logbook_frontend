import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage for persistence
import {thunk} from "redux-thunk"; // ✅ Import thunk correctly

// 🚀 Import Reducers
import authReducer from "./slices/authSlice";
import tripReducer from "./slices/tripSlice";
import logReducer from "./slices/logSlice";
import complianceReducer from "./slices/complianceSlice";
import truckReducer from "./slices/truckSlice"; // ✅ Added Truck Slice
import driverReducer from "./slices/driverSlice"; // ✅ Added Driver Slice

// 🗂️ Persist Configuration
const persistConfig = {
  key: "root", // Root key for Redux persistence
  storage, // Uses localStorage
  whitelist: ["auth"], // ✅ Persist only authentication state (Prevents large storage)
};

// 🎯 Combine All Reducers
const rootReducer = combineReducers({
  auth: authReducer,
  trips: tripReducer,
  logs: logReducer,
  compliance: complianceReducer,
  trucks: truckReducer, // ✅ Added Trucks Reducer
  drivers: driverReducer, // ✅ Added Drivers Reducer
});

// 🔄 Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🏗️ Configure Redux Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Fix non-serializable warning
    }).concat(thunk),
  devTools: process.env.NODE_ENV !== "production", // Enables Redux DevTools in development
});

// 🔄 Persistor (Handles state persistence)
const persistor = persistStore(store);

// 🎯 Export Store & Persistor
export { store, persistor };
