import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

interface UserState {
  user: { id: number; email: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Register a new user
export const registerUser = createAsyncThunk(
  "user/register",
  async (
    userData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/register", userData);
      console.log("response register: ", response.data);
      return response.data; // Expecting JWT and user info
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Registration failed"
      );
    }
  }
);

// Log in a user
export const loginUser = createAsyncThunk(
  "user/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
        console.log("API Response:", response.data); // Debug log
      return response.data; // Expecting JWT and user info
    } catch (error: any) {
       console.error("Login API error:", error.response.data); // Debug log
      return rejectWithValue(error.response.data.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async ( _, { dispatch} ) => {
    // Remove user data from local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

     // Dispatch the logout action to clear state
     dispatch(logout());
  }
)

// Slice definition
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { id: action.payload.id, email: action.payload.email };
        state.token = action.payload.token;
        console.log("Login success: User updated", state.user); // Debug log
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log("Login failed:", state.error); // Debug log
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
