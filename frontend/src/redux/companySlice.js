import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getErrorMessage } from "../utils/api.js";

export const fetchCompanies = createAsyncThunk("companies/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/company/get");
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load companies"));
  }
});

export const fetchCompanyById = createAsyncThunk("companies/fetchById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/company/get/${id}`);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load company"));
  }
});

export const createCompany = createAsyncThunk("companies/create", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/company/create", payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to create company"));
  }
});

export const updateCompany = createAsyncThunk("companies/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/company/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to update company"));
  }
});

const companySlice = createSlice({
  name: "companies",
  initialState: {
    companies: [],
    selectedCompany: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCompany = action.payload;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.unshift(action.payload);
        state.selectedCompany = action.payload;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.map((company) => (company._id === action.payload._id ? action.payload : company));
        state.selectedCompany = action.payload;
      })
      .addMatcher((action) => action.type.startsWith("companies/") && action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith("companies/") && action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default companySlice.reducer;
