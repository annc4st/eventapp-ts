import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { RootState } from "./store"; // for update can only author/owner


export interface Group {
  groupId: number;
  groupName: string;
  description?: string;
  adminId: number;
  // members: Membership[];
  createdAt: string;
}

// Member type
export interface Member {
    id: number;
    email: string;
  }

// Define the shape of the slice's state
  interface SingleGroupState {
    singleGroup: Group | null;
    members: Member [];
    loading: boolean;
    error: string | null;
  }
  const initialState: SingleGroupState = {
    singleGroup: null,
    members: [],
    loading: false,
    error: null,
  };

// view group by id
export const fetchSingleGroup = createAsyncThunk (
    "group/fetchSingle",
    // id or groupId ???
    async (groupId: number, { rejectWithValue}) => {
        try {
            const response = await api.get(`/groups/${groupId}`)
            console.log("view single group ", response.data)
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data.message || error.message)
        }
    }
)

// Fetch groupmembers
export const fetchGroupMembers = createAsyncThunk (
    "group/fetchMembers",
    async (groupId: number, { rejectWithValue}) => {
        try {
            const response = await api.get(`/groups/${groupId}/members`)
            console.log("group members" , response.data.members)
            return response.data.members;
        } catch(error: any){
            return rejectWithValue(error.response?.data.message || error.message)
        }
    })

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
            .addCase(fetchGroupMembers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGroupMembers.fulfilled, (state, action) => {
                state.loading = false;
                state.members = action.payload;
            })
            .addCase(fetchGroupMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        }
    }

)

export default singleGroupSlice.reducer;