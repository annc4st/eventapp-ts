import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { RootState } from "./store"; // for update can only author/owner


export interface Group {
  id: number;
  groupName: string;
  description?: string;
  adminId: number;
  // members: Membership[];
  createdAt: string;
}

// Define the shape of the slice's state
  interface SingleGroupState {
    singleGroup: Group | null;
    loading: boolean;
    error: string | null;
  }
  const initialState: SingleGroupState = {
    singleGroup: null,
    loading: false,
    error: null,
  };

// view group by id
export const fetchSingleGroup = createAsyncThunk (
    "group/fetchSingle",
    // id or groupId ???
    async (id: number, { rejectWithValue}) => {
        try {
            const response = await api.get (`/groups/${id}`)
            console.log("view single group ", response.data)
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data.message || error.message)
        }
    }
)
// update group

const singleGroupSlice = createSlice(
    {
        name: "singleGroup",
        initialState,

        reducers: {},

        extraReducers: (builder) => {
            builder
            .addCase(fetchSingleGroup.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSingleGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.singleGroup = action.payload;
            })
            .addCase(fetchSingleGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
        }
    }

)

export default singleGroupSlice.reducer;