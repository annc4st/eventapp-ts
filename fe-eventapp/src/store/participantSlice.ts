import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { RootState } from "./store";

export interface Participant {
  id: number;
  eventId: number;
  userId?: number;
}

// Define the shape of the slice's state

export interface ParticipantState {
  participants: Participant[];
  participantCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: ParticipantState = {
  participants: [],
  participantCount: 0,
  loading: false,
  error: null,
};

// get participants
export const fetchParticipants = createAsyncThunk(
  "participants/fetchAll",
  async (eventId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/events/${eventId}/participants`);
      console.log("participants ", response.data)
      return response.data; //should be a list
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch participants count
// export const fetchParticipantsCount = createAsyncThunk(
//   "fetchParticipantsCount",
//   async (eventId: number, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`/events/${eventId}/participants`);
//       return response.data.length; // Assuming the API returns a list of participants
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// Sign up for event
export const signUpForEvent = createAsyncThunk(
  "event/signUpForEvent",
  async (eventId: number, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;
    if (!token) {
      return rejectWithValue("Unauthorized: No authentication token found");
    }

    try {
      const response = await api.post(
        `/events/${eventId}/participants`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("participant sign up OK ", response.data)
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Unsign from an event (protected route)
export const unsignFromEvent = createAsyncThunk(
  "event/unsignFromEvent",
  async (eventId: number, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const token = state.user.token;

    if (!token) {
      return rejectWithValue("Unauthorized: No authentication token found");
    }

    try {
      await api.delete(`/events/${eventId}/participants`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return eventId; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  Create the Particpants slice

const participantSlice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    //optimistic update
    optimisticAdd(state, action) {
      state.participants.unshift(action.payload);
      state.participantCount += 1; 
    },
    optimisticRemove(state, action) {
      state.participants = state.participants.filter(
        (participant) => participant.id !== action.payload.id
      );
      state.participantCount -= 1;
    },
  },

  extraReducers: (builder) => {
    builder
      // .addCase(fetchParticipantsCount.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(fetchParticipantsCount.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.participantCount = action.payload; //??? or singleevent
      // })
      // .addCase(fetchParticipantsCount.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })

      // Fetch participants list
      .addCase(fetchParticipants.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = action.payload;
        state.participantCount = action.payload.length;
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //signup for event
      .addCase(signUpForEvent.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(signUpForEvent.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(signUpForEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { optimisticAdd, optimisticRemove} = participantSlice.actions;
export default participantSlice.reducer;
