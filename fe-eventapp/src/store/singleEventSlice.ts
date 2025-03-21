import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { RootState } from "./store";


// Event Interface
export interface Event {
    id: number;
    name: string;
    distance?: number;
    ticketPrice?: number;
    date: string;
    locationId: number;
    userId?: number;
  }

// Define the shape of the slice's state
  interface SingleEventState {
    singleEvent: Event | null;
    loading: boolean;
    error: string | null;
  }

  const initialState: SingleEventState = {
    singleEvent: null,
    loading: false,
    error: null,
  };


  // Fetch a single event by ID
export const fetchSingleEvent = createAsyncThunk(
    "event/fetchSingle",
    async (id: number, { rejectWithValue }) => {
    try {
             
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error: any) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch single event"
        );
      }
});
  
// Update an existing event
export const updateSingleEvent = createAsyncThunk(
    "event/update",
    async (eventData: Event, { rejectWithValue, getState }) => {
      try {
        const state = getState() as RootState; 
        const token = state.user?.token; // Adjust based on where your token is stored
        if (!token) {
          return rejectWithValue("Unauthorized: No authentication token found");
        }
        const response = await api.patch(`/events/${eventData.id}`, eventData,
          {
            headers: { Authorization: `Bearer ${token}` },
        }
        );
//         console.log("Updating Event:", eventData);
// console.log("Sending PATCH request to:", `/events/${eventData.id}`);
        return response.data; // Expecting the updated event
      } catch (error: any) {
        console.error("Error updating event:", error.response?.data);
        return rejectWithValue(
          error.response.data.message || "Failed to update single event"
        );
      }
    });
  
  const singleEventSlice = createSlice({
    name: "singleEvent",
    initialState,
     
    reducers: {},
    
    extraReducers: (builder) => {
      builder
        .addCase(fetchSingleEvent.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchSingleEvent.fulfilled, (state, action) => {
          state.loading = false;
          state.singleEvent = action.payload;
        })
        .addCase(fetchSingleEvent.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(updateSingleEvent.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateSingleEvent.fulfilled, (state, action) => {
            state.loading = false;
        state.singleEvent = action.payload;
        })
        .addCase(updateSingleEvent.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          });
    },
  });

  export default singleEventSlice.reducer;