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
export interface GroupNewsState {
  groupNews: IGroupNews [];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: GroupNewsState  = {
    groupNews: [],
    loading: false,
    error:  null,
}


// GET All news
export const fetchGroupNewsByGroupId = createAsyncThunk<
IGroupNews[],
number, // groupid
{state: RootState}
> ("news/fetchAll",
    async(groupId: number, {rejectWithValue}) => {
        try {
            const response = await api.get(`/groups/${groupId}/news`);
            return response.data as IGroupNews[];
        } catch (error: any){
            return rejectWithValue(
                error.response.data.message || "Failed to fetch groupnews"
            );
        }
    }
)



// Post news
export const addNews = createAsyncThunk<
IGroupNews,
{ groupId: number; newsData: Omit<IGroupNews, "id" | "groupId"> },
{state: RootState}
>(
    "news/create",
    async( { groupId, newsData }, {rejectWithValue, getState }) => {
        try {
            const token = getState().user?.token;
            if (!token) {
                return rejectWithValue("Unauthorized: No authentication token found");
              }
              const response = await api.post(
               `/groups/${groupId}/news`,
               newsData,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              console.log("Creating news  >> rsponse.data ", response.data);
              return response.data;
        } catch (error: any){
            return rejectWithValue(error.response?.data.message || "Failed to create news");
        }
    }
)



// Create groupNews slice

const groupNewsSlice = createSlice({
    name: "groupNews",
    initialState,
    reducers: {
        //optimistic update
    optimisticAdd(state, action) {
         state.groupNews.unshift(action.payload); //adds new elements to the beginning of an array.
        },
    },

    extraReducers: (builder) => {
        builder

//  1  fetch all news for a particular group
        .addCase(fetchGroupNewsByGroupId.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchGroupNewsByGroupId.fulfilled,  (state, action) => {
            state.loading = false;
            state.groupNews = action.payload;
        })
        .addCase(fetchGroupNewsByGroupId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
// 2 Add news
        .addCase(addNews.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addNews.fulfilled,  (state) => {
            state.loading = false;
            
        })
        .addCase(addNews.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
})



export const { optimisticAdd } = groupNewsSlice.actions;
export default groupNewsSlice.reducer;