import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

interface User {
    id: string;
    email: string;
 // adding others fields as app grows
  }

  interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
  }


  // Initial state
const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
  };


  // Async thunk to fetch all users
export const fetchAllUsers = createAsyncThunk("users/fetchAllUsers", 
    async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/auth/`) // Adjust to match your backend route
       
      return await response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  });

  const allUserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllUsers.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllUsers.fulfilled, (state, action) => {
          state.loading = false;
          state.users = action.payload;
        })
        .addCase(fetchAllUsers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  export default allUserSlice.reducer;