import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getErrorMessage } from "../utils/api.js";
import { USER_KEY } from "../utils/constants.js";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

const storedUser = getStoredUser();

export const registerUser = createAsyncThunk("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/user/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Registration failed"));
  }
});

export const loginUser = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/user/login", payload);
    localStorage.setItem(USER_KEY, JSON.stringify(data.data));
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Login failed"));
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await api.get("/user/logout");
    localStorage.removeItem(USER_KEY);
    return null;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Logout failed"));
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/user/profile/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    localStorage.setItem(USER_KEY, JSON.stringify(data.data));
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Profile update failed"));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    loading: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearSession: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem(USER_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, clearSession } = authSlice.actions;
export default authSlice.reducer;
