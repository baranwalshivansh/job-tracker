import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import jobReducer from "./jobSlice.js";
import companyReducer from "./companySlice.js";
import applicationReducer from "./applicationSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    companies: companyReducer,
    applications: applicationReducer,
  },
});

export default store;
