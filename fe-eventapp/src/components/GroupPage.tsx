import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { RootState, AppDispatch } from "../store/store";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSingleGroup, fetchGroupMembers } from "../store/singleGroupSlice";
import { PendingGroupRequests } from "./PendingGroupRequests";
import {
  requestToJoinGroup,
  leaveGroup,
  fetchingPendingRequests,
} from "../store/groupMembershipSlice";
import { logoutUser } from "../store/userSlice";
import Button from '@mui/material/Button';
import { GroupNewsList } from "./GroupNewsList";


export const GroupPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groupId } = useParams<{ groupId: string }>();
  const numericGroupId = Number(groupId);

  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  if (isNaN(numericGroupId)) {
    console.error("Invalid group ID:", groupId);
    return <div>Error: Invalid group ID</div>;
  }

  const { user, tokenExpiresAt } = useSelector(
    (state: RootState) => state.user
  );
  const userId = Number(user?.id);

  const { singleGroup, members, loading, error } = useSelector(
    (state: RootState) => state.singleGroup
  );

  const { pendingRequests } = useSelector(
    (state: RootState) => state.groupMembership
  );

  //  Check whether token is expired and compare with current time
  const isTokenExpired = (tokenExpiresAt: string | null) => {
    if (!tokenExpiresAt) return false;
    return new Date(tokenExpiresAt).getTime() < Date.now(); // Compare with current time
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (tokenExpiresAt && isTokenExpired(tokenExpiresAt)) {
      toast.error("Your session has expired. Please log in again.");
      dispatch(logoutUser());
      navigate("/login");
    }
    if (numericGroupId > 0) {
      dispatch(fetchSingleGroup(numericGroupId));
      dispatch(fetchGroupMembers(numericGroupId));
      dispatch(fetchingPendingRequests(numericGroupId));
    }
  }, [dispatch, tokenExpiresAt, numericGroupId]);

  //  check is user has pending request
  const hasPendingRequest = pendingRequests.some((r) => r.userId == userId);

  // Check if user is already a member of the group ~ singlegroupSlice
  const isMember = members.some((member) => member.id === userId);

  // Check if user is logged in
  const isUserLogged = Boolean(user?.id);

  // Check if user is the admin
  const isAdmin = userId === singleGroup?.adminId;

  const handleRequestJoin = async (numericGroupId: number) => {
    await dispatch(requestToJoinGroup(numericGroupId));
    dispatch(fetchingPendingRequests(numericGroupId)); //   update pending requests
    toast.success("Request to join sent!");
  };

  const handleLeaveGroup = async (numericGroupId: number) => {
    setIsLeaving(true); // Show loading state
    setLeaveSuccess(false); // Reset success message
    try {
      await dispatch(leaveGroup(numericGroupId)).unwrap();
      // The .unwrap() method is used with Redux Toolkit's createAsyncThunk actions.
      // It extracts the actual fulfilled/rejected value from the thunk,
      // so you can handle errors synchronously without relying on action.payload inside catch.
      setLeaveSuccess(true); // Show success message
    } catch (error) {
      console.error("Failed to leave group:", error);
      alert("Failed to leave the group.");
    } finally {
      setIsLeaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div>
        {singleGroup && (
          <>
            <h2>{singleGroup.groupName}</h2>
            <p>{singleGroup.description}</p>

            {/* Status of the user */}
            <div className="user-status">
              <p>Your status in this group: </p>
              {isAdmin && (
                <p style={{ color: "blue" }}>
                  You are the admin of this group.
                </p>
              )}
              {!leaveSuccess && isMember && !isAdmin && (
                <p style={{ color: "green" }}>You are an approved member.</p>
              )}

              {leaveSuccess && (
                <p style={{ color: "brown" }}>You have left the group.</p>
              )}

              {hasPendingRequest && (
                <p style={{ color: "orange" }}>
                  Your request to join is pending approval.
                </p>
              )}
              {!isMember && !hasPendingRequest && isUserLogged && !isAdmin && (
                <p style={{ color: "red" }}>You are not a member yet.</p>
              )}
              {!isUserLogged && <p>Please log in to send a request.</p>}
            </div>

            {/* User left */}

            {/* Action Buttons */}
            <div className="group-actions">
              {/* USer should be logged in */}
              {!isUserLogged && (
                <button disabled className="btn-disabled">
                  {" "}
                  Log in to send request
                </button>
              )}

              {/* User is the admin */}
              {isAdmin && (
                <button disabled className="btn-disabled">
                  You are the admin
                </button>
              )}

              {/*  User is a member - show "Leave Group" button */}
              {isMember && !isAdmin && (
                <Button variant="outlined"
                  onClick={() => handleLeaveGroup(numericGroupId)}
                  className="btn-delete"
                  disabled={isLeaving || leaveSuccess}
                  style={{
                    opacity: isLeaving ? 0.7 : 1,
                    cursor:
                      isLeaving || leaveSuccess ? "not-allowed" : "pointer",
                  }}
                >
                  {isLeaving
                    ? "Leaving..."
                    : leaveSuccess
                    ? "Left ✅"
                    : "Leave Group"}
                </Button>
              )}

              {/* User is not a member - show "Join Group" button */}
              {isUserLogged && !isMember && !hasPendingRequest && !isAdmin && (
                <>
                  <Button variant="contained" color="success"
                    onClick={() => handleRequestJoin(numericGroupId)}
                    className="btn-join"
                  >
                    Join {singleGroup.groupName}
                  </Button>
                  <ToastContainer />
                </>
              )}

              {/* user has pending request */}
              {hasPendingRequest && (
                <button disabled className="btn-disabled">
                  Your request to join is pending
                </button>
              )}
            </div>

            <div>
              <GroupNewsList groupId = {numericGroupId} />
            </div>

            {/* for admin eyes only - pending requests */}
            {isAdmin && (
              <div>
                <PendingGroupRequests groupId={numericGroupId} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
