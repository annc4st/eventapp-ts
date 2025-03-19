import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { RootState } from "./store";


export interface IGroupNews {
  id: number;
  newsName: string;
  content: string;
  createdAt: string;
  newsImg?: string;
  groupId: number;
  userId: number;
  user?: { id: number; email: string };  
}

// Define the shape of the slice's state
export interface SingleNewsState {
    singleNews: IGroupNews | null;
    loading: boolean;
    error: string | null;
}


// Initial state
const initialState: SingleNewsState = {
    singleNews: null,
    loading: false,
    error: null,
  };

// 1 Get news:id
export const fetchGroupNewsById = createAsyncThunk<
IGroupNews,
{ groupId: number; newsId: number },
{state: RootState}> (
    "news/fetchSingle",
    async( {groupId , newsId}, {rejectWithValue}) => {
        try {
            const response = await api.get(`/groups/${groupId}/news/${newsId}`);
            return response.data;
        } catch (error: any){
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch single groupnews"
            );
        }
    }
)


// Create singleNews slice
const singleNewsSlice = createSlice({
    name: "singleNews",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchGroupNewsById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchGroupNewsById.fulfilled, (state, action) => {
          state.loading = false;
          state.singleNews = action.payload;
        })
        .addCase(fetchGroupNewsById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  export default singleNewsSlice.reducer;