import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getErrorMessage } from "../utils/api.js";

export const fetchJobs = createAsyncThunk("jobs/fetchAll", async (keyword = "", { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/job/get${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ""}`);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load jobs"));
  }
});

export const fetchJobById = createAsyncThunk("jobs/fetchById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/job/get/${id}`);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load job"));
  }
});

export const fetchRecruiterJobs = createAsyncThunk("jobs/fetchRecruiter", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/job/getadminjobs");
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load recruiter jobs"));
  }
});

export const createJob = createAsyncThunk("jobs/create", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/job/create", payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to create job"));
  }
});

export const updateJob = createAsyncThunk("jobs/update", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/job/update/${id}`, payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to update job"));
  }
});

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    recruiterJobs: [],
    selectedJob: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchRecruiterJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.recruiterJobs = action.payload;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.recruiterJobs.unshift(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        state.recruiterJobs = state.recruiterJobs.map((job) => (job._id === action.payload._id ? action.payload : job));
        state.selectedJob = action.payload;
      })
      .addMatcher((action) => action.type.startsWith("jobs/") && action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith("jobs/") && action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedJob } = jobSlice.actions;
export default jobSlice.reducer;
