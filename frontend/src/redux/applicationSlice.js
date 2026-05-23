import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getErrorMessage } from "../utils/api.js";

export const applyForJob = createAsyncThunk("applications/apply", async (jobId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/application/apply/${jobId}`);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to apply for job"));
  }
});

export const fetchAppliedJobs = createAsyncThunk("applications/fetchApplied", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/application/get");
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load applications"));
  }
});

export const fetchApplicants = createAsyncThunk("applications/fetchApplicants", async (jobId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/application/${jobId}/applicants`);
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to load applicants"));
  }
});

export const updateApplicationStatus = createAsyncThunk("applications/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/application/status/${id}/update`, { status });
    return data.data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Unable to update status"));
  }
});

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    appliedJobs: [],
    applicantsJob: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs = action.payload;
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicantsJob = action.payload;
      })
      .addCase(applyForJob.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.applicantsJob?.applications) {
          state.applicantsJob.applications = state.applicantsJob.applications.map((application) =>
            application._id === action.payload._id ? action.payload : application
          );
        }
      })
      .addMatcher((action) => action.type.startsWith("applications/") && action.type.endsWith("/pending"), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher((action) => action.type.startsWith("applications/") && action.type.endsWith("/rejected"), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default applicationSlice.reducer;
