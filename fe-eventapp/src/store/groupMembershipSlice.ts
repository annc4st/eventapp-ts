import { createSlice, createAsyncThunk, isRejectedWithValue, PayloadAction } from "@reduxjs/toolkit";
import api from "../utils/api";
import { RootState } from "./store";

export enum MembershipStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IGroupMembership {
  id: number;
  groupId: number;
  userId: number;
  status: MembershipStatus;
  user?: { id: number; email: string }; // Include user details
}

// Define the shape of the slice's state
export interface GroupMembershipState {
  pendingRequests: IGroupMembership[];
  approvedMembers: IGroupMembership[];
  loading: boolean;
  error: string | null;
}
// Initial state
const initialState: GroupMembershipState = {
  pendingRequests: [],
  approvedMembers: [],
  loading: false,
  error: null,
};

// 1️⃣ User requests to join a group
export const requestToJoinGroup = createAsyncThunk<
  IGroupMembership,
  number, // Payload type (groupId)
  { state: RootState }
>("group/requestToJoin", async (groupId, { rejectWithValue, getState }) => {
  try {
    const token = getState().user?.token;
    if (!token) {
      return rejectWithValue("Unauthorized: No authentication token found");
    }
    const response = await api.post(
      `/groups/${groupId}/join`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Requesting to join a group >> data ", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error requesting to join a group", error.response?.data);
    return rejectWithValue(
      error.response.data.message || "Failed to send request"
    );
  }
});

// Fetch pending requests thunk
export const fetchingPendingRequests = createAsyncThunk<
IGroupMembership[], // Expected return type
  number, // Payload type (groupId)
  { state: RootState }
>("group/fetchingPendingRequests", async (groupId, {rejectWithValue, getState }) => {
  try {
    const token = getState().user?.token;
    if (!token) return rejectWithValue("Unauthorized");

    console.log(`Fetching pending requests for group ${groupId}`);

    const response = await api.get(`/groups/${groupId}/pending-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Fetched pending requests (API Response):", response.data);
    return response.data; // Returns an array of pending requests

  } catch(error: any) {
    console.error("Error fetching pending requests", error.response?.data);
    return rejectWithValue(error.response?.data?.message || "Failed to fetch pending requests");
  }
})



// groupAdmin approved request
export const approveMemberRequest = createAsyncThunk<
  IGroupMembership, // Expected return type
  { groupId: number; userId: number }, // Payload type
  { state: RootState }
>(
  "group/approveMember",
  async ({ groupId, userId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().user?.token;
      if (!token) return rejectWithValue("Unauthorized");

      const response = await api.patch(
        `/groups/${groupId}/approve/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Approved member:", response.data);
      return response.data; // The updated membership object
    } catch (error: any) {
      return rejectWithValue( error.response?.data?.message || "Failed to approve user");
    }
  }
);

// groupAdmin invites user
export const inviteUserToGroup = createAsyncThunk<
  IGroupMembership,
  { groupId: number; userId: number },
  { state: RootState }
>(
  "group/inviteUserToGroup",
  async ({ groupId, userId }, { rejectWithValue, getState }) => {
    try {
      const token = getState().user?.token;
      if (!token) return rejectWithValue("Unauthorized");

      const response = await api.post(
        `/groups/${groupId}/invite`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Invited user:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to invite user");
    }
  }
);


// User leaves the group
export const leaveGroup = createAsyncThunk<
IGroupMembership,
number, // Payload type (groupId)
{ state: RootState }>( 
  "group/leaveGroup",
  async (groupId,  { rejectWithValue, getState }) => {

    try {
      const token = getState().user?.token;
      if (!token) return rejectWithValue("Unauthorized");

      const response = await api.delete(`/groups/${groupId}/leave`,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      console.log("Leaving user:", response.data);
      return response.data;
    }
    catch(error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to leave the group");
    }
  }
)


// 🔹 Group Membership Slice
const groupMembershipSlice = createSlice({
    name: "groupMembership",
    initialState,
    reducers: {
      groupMemberLeft: (state, action: PayloadAction<number>) => {
        // Remove the user from members immediately
        console.log("Leave group payload:", action.payload);
        state.approvedMembers = state.approvedMembers.filter(member => member.userId !== action.payload);
      },
      groupMemberRejoined: (state, action: PayloadAction<number>) => {
        // Restore user if the leave group request fails
        state.approvedMembers.push({ id: action.payload } as IGroupMembership);
      },
    },
    extraReducers: (builder) => {
      builder
// 1 Request to Join Group
        .addCase(requestToJoinGroup.pending, (state) => {
          state.loading = true;
        })
        .addCase(requestToJoinGroup.fulfilled, (state, action) => {
          state.loading = false;
          state.pendingRequests.push(action.payload); // Add to pending requests
        })
        .addCase(requestToJoinGroup.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
// 2 Approve Membership
        .addCase(approveMemberRequest.fulfilled, (state, action) => {
          state.pendingRequests = state.pendingRequests.filter(
            (req) => req.userId !== action.payload.userId
          );
          state.approvedMembers.push(action.payload); // Move to approved list
        })
  
// 3 Invite User to Group 
        .addCase(inviteUserToGroup.fulfilled, (state, action) => {
          console.log("Invite added:", action.payload);
          state.loading = false;
          state.error = null;
        })
        .addCase(fetchingPendingRequests.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchingPendingRequests.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
// 4 Fetching pending requests
        .addCase(fetchingPendingRequests.fulfilled, (state, action) => {
          state.loading = false;
          state.pendingRequests = action.payload;
          console.log("Updated Redux state with pending requests:", state.pendingRequests);
        })
  
// 5 Leave the group
    .addCase(leaveGroup.fulfilled, (state, action) => {
      console.log("Leave group payload:", action.payload); // This is groupId
      const currentUserId =  state.approvedMembers.find((member) => member.userId)?.userId;
      console.log(currentUserId)
      if (!currentUserId) {
        console.warn("No user ID found in state, skipping optimistic update");
        return;
      }

      // Remove the current user from approvedMembers
  state.approvedMembers = state.approvedMembers.filter( (member) => member.userId !== currentUserId);
      
    });
    },
  });
  
   export const { groupMemberLeft, groupMemberRejoined } = groupMembershipSlice.actions;
   export default groupMembershipSlice.reducer;
