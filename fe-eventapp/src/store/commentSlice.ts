import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { RootState } from "./store";

export interface Comment {
  createdAt: string | number | Date;
  id: number;
  content: string;
  eventId: number;
  userId?: number;
  partEmail?: string; 
}


// Define the shape of the slice's state
export interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

// fetch all
export const fetchCommentsByEventId = createAsyncThunk(
  "comments/fetchAll",
  async (eventId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/events/${eventId}/comments`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch comments"
      );
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/create",
  async (commentData: Omit<Comment, "id">, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState; 
      const token = state.user.token; // Adjust based on where your token is stored
      if (!token) {
        return rejectWithValue("Unauthorized: No authentication token found");
      }
      
      const response = await api.post(
        `/events/${commentData.eventId}/comments`,
        commentData, 
        {
          headers: { Authorization: `Bearer ${token}` },
      }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to create comment"
      );
    }
  }
);
// Create the comment slice
const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    //optimistic update
    optimisticAdd(state, action) {
      state.comments.unshift(action.payload);
  },
},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByEventId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByEventId.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByEventId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //CREATE Comment
      .addCase(addComment.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        // No need to push again, as we already updated optimistically
        // state.comments.push(action.payload); 
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { optimisticAdd } = commentSlice.actions;
export default commentSlice.reducer;
