import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

interface UserState {
  user: { id: number; email: string } | null;
  token: string | null;
  tokenExpiresAt: string | null; //to track token expiration
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  tokenExpiresAt: null,
  loading: false,
  error: null,
};

// Register a new user
export const registerUser = createAsyncThunk(
  "user/register",
  async ( userData: { email: string; password: string },
    { rejectWithValue }) => {
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
    localStorage.removeItem("tokenExpiresAt");

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
// REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { id: action.payload.id, email: action.payload.email };
        state.token = action.payload.token;
        state.tokenExpiresAt = action.payload.expiresAt;  // <-- Store expiration time
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
// LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { id: action.payload.id, email: action.payload.email };
        state.token = action.payload.token;
        state.tokenExpiresAt = action.payload.expiresAt;  // <-- Store expiration time
        console.log("Login success: User updated", state.user); // Debug log
        console.log("tokenExpiresAt ", state.tokenExpiresAt)
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
        state.tokenExpiresAt = null; // Reset expiration
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected") && action.payload === "Token expired",
        (state) => {
          state.user = null;
          state.token = null;
          state.tokenExpiresAt = null;
          console.warn("Token expired, user logged out");
        }
      );
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;


/*
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
import { RootState } from "../store/store";

interface User {
  id: string;
  email: string;
  token: string | null;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Helper function to check if token is expired
const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Convert expiration to milliseconds
  } catch (error) {
    return true; // If decoding fails, assume token is invalid
  }
};

// Load persisted user but check token expiration
const loadUser = () => {
  const persistedUser = JSON.parse(localStorage.getItem("persist:root") || "{}")?.user;
  if (!persistedUser) return null;

  try {
    const user = JSON.parse(persistedUser);
    return isTokenExpired(user.token) ? null : user;
  } catch {
    return null;
  }
};

const initialState: UserState = {
  user: loadUser(),
  loading: false,
  error: null,
};

// Async thunk to log out user
export const logoutUser = createAsyncThunk("user/logout", async (_, { dispatch }) => {
  localStorage.removeItem("persist:root");
  dispatch(userSlice.actions.setUser(null));
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
    });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

*/