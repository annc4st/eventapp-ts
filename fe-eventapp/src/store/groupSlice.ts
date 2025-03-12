import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { RootState } from "./store";


export interface IGroup {
  id: number;
  groupName: string;
  description?: string;
  adminId: number;
  // members: Membership[];
  createdAt: string;
}

// Define the shape of the slice's state

export interface GroupState {
  groups: IGroup[];
  groupCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  groupCount: 0,
  loading: false,
  error: null,
};

// get groups

export const fetchGroups = createAsyncThunk(
  "groups/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/groups");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch groups."
      );
    }
  }
);

// create new group
export const createGroup = createAsyncThunk(
  "groups/create",
  async (groupData: Omit<IGroup, "id">, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.user?.token;
      if (!token) {
        return rejectWithValue("Unauthorized: No authentication token found");
      }

      const response = await api.post("/groups", groupData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Creating group ", groupData); /// remove when ok
      console.log("Sending POST request to:", `/groups/`);
      return response.data;
    } catch (error: any) {
      console.error("Error creating group:", error.response?.data);
      return rejectWithValue(
        error.response.data.message || "Failed to create group"
      );
    }
  }
);


// create group slice
const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
     //optimistic update
     optimisticAdd(state, action) {
      state.groups.unshift(action.payload);
  },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload.groups ?? action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { optimisticAdd } = groupSlice.actions;
export default groupSlice.reducer;