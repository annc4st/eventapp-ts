import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";
import { RootState } from "./store";


export interface Location {
    id: number;
    firstLine:  string;
    city:      string;
    postcode:  string;
}

  // Define the shape of the slice's state
  export interface LocationState {
    locations: Location[];
    loading: boolean;
    error: string | null;
  }
// Initial state
  const initialState: LocationState = {
    locations: [],
    loading: false,
    error: null,
  }

// Thunk to fetch all locations 

export const fetchLocations = createAsyncThunk("locations/fetchAll", async ( _, {rejectWithValue}) => {
    try {
        const response = await api.get("/locations");
        return response.data; // Expecting an array of locations
    } catch (error : any){
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch locations");
    }
});

//Thunk to fetch single location
export const fetchLocationById = createAsyncThunk("locations/fetchById", async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/locations/${id}`);
      return response.data; // Expecting a single location
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch location");
    }
  });

// Thunk to Create a new lcation
  export const createLocation = createAsyncThunk(
    "locations/create",
    async (locationData: Omit<Location, "id">, { rejectWithValue, getState }) => {
      try {
        const state = getState() as RootState; 
                const token = state.user?.token; 
                if (!token) {
                  return rejectWithValue("Unauthorized: No authentication token found");
                }
        
        const response = await api.post("/locations", locationData,
          {
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        return response.data; 
      } catch (error: any) {
        return rejectWithValue(error.response.data.message || "Failed to create location");
      }
    });
    
// location slice
const locationSlice = createSlice({
    name: "locations",
    initialState,
    reducers: {
      //optimistic update
      optimisticAdd(state, action) {
        state.locations.unshift(action.payload);
    },
  },

    extraReducers: (builder) => {
        builder
          .addCase(fetchLocations.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchLocations.fulfilled, (state, action) => {
            state.loading = false;
            state.locations = action.payload;
          })
          .addCase(fetchLocations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
          })
      // CREATE location
          .addCase(createLocation.pending, (state) => {
            state.loading = false;
            state.error = null;
          })
          .addCase(createLocation.fulfilled, (state, action) => {
            state.loading = false;
        // No need to push again, as we already updated optimistically
            // state.locations.push(action.payload);
          })
          .addCase(createLocation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            // Optional: Rollback optimistic update if needed
          })
          .addCase(fetchLocationById.fulfilled, (state, action) => {
            const index = state.locations.findIndex((loc) => loc.id === action.payload.id);
            if (index !== -1) {
              state.locations[index] = action.payload; // Update the existing location
            } else {
              state.locations.push(action.payload); // Add the location if it doesn't exist
            }
          });

          //to add delete api func then add >>
        //   builder.addCase(deleteLocation.fulfilled, (state, action) => {
        //     state.locations = state.locations.filter((loc) => loc.id !== action.payload);
        //   });
    }
})

export const { optimisticAdd } = locationSlice.actions;
export default locationSlice.reducer;