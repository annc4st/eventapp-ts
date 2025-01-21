import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  eventId: number;
  userId?: number;
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
  async (commentData: Omit<Comment, "id">, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/events/${commentData.eventId}/comments`,
        commentData
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
  reducers: {},

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
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default commentSlice.reducer;
