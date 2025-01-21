import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";


export interface Event {
  id: number;
  name: string;
  distance?: number;
  ticketPrice?: number;
  date: string;
  locationId: number;
  // userId?: number;
}

// Define the shape of the slice's state
export interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
};
// Fetch all events
export const fetchEvents = createAsyncThunk(
  "events/",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/events");
      return response.data; // Expecting an array of events
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to fetch events"
      );
    }
  }
);

// Create a new event
export const createEvent = createAsyncThunk(
  "events/create",
  async (eventData: Omit<Event, "id">, { rejectWithValue }) => {
    try {
      const response = await api.post("/events", eventData);
      return response.data; // Expecting the created event
    } catch (error: any) {
      return rejectWithValue(
        error.response.data.message || "Failed to create event"
      );
    }
  }
);

// Create the event slice
const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default eventSlice.reducer;
