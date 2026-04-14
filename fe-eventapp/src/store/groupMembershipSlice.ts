import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import api from "../utils/api";
import { RootState } from "./store";
import { group } from "node:console";
import { Action } from "@radix-ui/themes/components/alert-dialog";
 

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
  user?: { id: number; email: string };  
}


// Define the shape of the slice's state
export interface GroupMembershipState {
  // memberships: IGroupMembership[]; // Holds all group memberships
  pendingRequests: IGroupMembership[];
  approvedMembers: IGroupMembership[];
  loading: boolean;
  error: string | null;
}
// Initial state
const initialState: GroupMembershipState = {
  // memberships: [],
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
>("group/requestToJoin", 
  async (groupId, { rejectWithValue, getState }) => {
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

// fetch approved members
export const fetchApprovedMembers = createAsyncThunk<
{members: IGroupMembership[]}, // Expected return type
  number, // Payload type (groupId)
  { state: RootState }
  >("groupMembership/fetchApprovedMembers",  
    async (groupId, {rejectWithValue, getState } ) => {
    try {
      const token = getState().user?.token;
      if (!token) return rejectWithValue("Unauthorized");
  
      console.log(`Fetching approved members for group ${groupId}`);
  

      const response = await api.get(`/groups/${groupId}/members`, 
        {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
      console.log("Fetched approved members(API Response):", response.data.members);
      return response.data.members;  

    } catch(error: any) {
      console.error("Error fetching members", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch approved members");
    }

  });

// Fetch pending requests thunk 
// GET /:groupId/pending-requests	List pending members	Populate pendingRequestsByGroup[groupId
export const fetchPendingRequests = createAsyncThunk<
IGroupMembership[], // Expected return type
  number, // Payload type (groupId)
  { state: RootState }
>("groupMembership/fetchingPendingRequests", async (groupId, {rejectWithValue, getState }) => {
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


// groupAdmin approves request
export const approveMember = createAsyncThunk<
  IGroupMembership, // Expected return type
  { groupId: number; userId: number }, // Payload type
  { state: RootState }
>(
  "groupMembership/approveMember",
  async ({ groupId, userId }, { rejectWithValue, getState, dispatch }) => {
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
  });

// groupAdmin rejects user request
export const rejectUser = createAsyncThunk<
IGroupMembership,
{ groupId: number; userId: number },
{ state: RootState }> (
  "groupMembership/rejectUser",
  async({groupId, userId}, {rejectWithValue, getState}) => {

    try {
      const token = getState().user?.token;
      if (!token) return rejectWithValue("Unauthorized");

      const response = await api.patch(`/groups/${groupId}/reject/${userId}`, 
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("rejectUser response : ", response.data)
      return response.data;

    } catch(error:any) {
      return rejectWithValue( error.response?.data?.message || "Failed to approve user");
    }
  }
)

// groupAdmin invites user
export const inviteUserToGroup = createAsyncThunk<
  IGroupMembership,
  { groupId: number; userId: number },
  { state: RootState }
>(
  "groupMembership/inviteUserToGroup",
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
  });


// User leaves the group
export const leaveGroup = createAsyncThunk<
IGroupMembership,  
number, // Payload type (groupId)
{ state: RootState }>( 
  "groupMembership/leaveGroup",
  async (groupId,  { rejectWithValue, getState }) => {

    try {
      const token = getState().user?.token;
      if (!token) return rejectWithValue("Unauthorized");

      const response = await api.delete(`/groups/${groupId}/leave`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Leaving user (slice):", response.data);
      return response.data;
    }
    catch(error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to leave the group");
    }
  });


// 🔹 Group Membership Slice
const groupMembershipSlice = createSlice({
    name: "groupMembership",
    initialState,
    reducers: {},
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
// 2  Approve user
      .addCase(approveMember.fulfilled, (state, action) => {
        const approvedUser = state.pendingRequests.find((m) => m.userId == action.payload.userId);
        if (approvedUser) {
          state.approvedMembers.push({ ...approvedUser, status: MembershipStatus.APPROVED });
          state.pendingRequests = state.pendingRequests.filter((m) => m.userId !== action.payload.userId);
        }
      })
  
// 3 Invite User to Group 
        .addCase(inviteUserToGroup.fulfilled, (state, action) => {
          console.log("Invite added:", action.payload);
          state.loading = false;
          state.error = null;
        })
        .addCase(fetchPendingRequests.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPendingRequests.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
 
// 4 Fetching pending requests
        .addCase(fetchPendingRequests.fulfilled, (state, action) => {
          state.loading = false;
          state.pendingRequests = action.payload;
          console.log("Updated Redux state with pending requests:", state.pendingRequests);
        })

    // fetching Approved members
    .addCase(fetchApprovedMembers.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchApprovedMembers.fulfilled, (state, action) => {
      state.loading = false;
      state.approvedMembers = action.payload;
      console.log("fetching approved members >> ", state.approvedMembers)
    })
    .addCase(fetchApprovedMembers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

  
// 5 Leave the group - do not need this ?
    .addCase(leaveGroup.fulfilled, (state, action) => {
      console.log("Leave group payload:", action.payload); // This is groupId
      const userId = action.payload.userId; 
      if (!userId) return;
  
      state.approvedMembers = state.approvedMembers.filter( (member) => member.userId !== userId);
     
    })
    .addCase(leaveGroup.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(leaveGroup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })

 
    //     // fetch members
    // .addCase(fetchApprovedMembers.fulfilled, (state, action) => {
    //   const existingIds = state.approvedMembers.map(member => member.id);
    //   const newMembers = action.payload.members.filter(
    //     member => !existingIds.includes(member.id)
    //   );
    //   state.approvedMembers = [...state.approvedMembers, ...newMembers];
    // })
      // Reject user
      .addCase(rejectUser.fulfilled, (state, action) => {
        state.pendingRequests = state.pendingRequests.filter((m) => m.userId !== action.payload.userId);
      });;
  }
  });
  
 
  
  export default groupMembershipSlice.reducer;
 
