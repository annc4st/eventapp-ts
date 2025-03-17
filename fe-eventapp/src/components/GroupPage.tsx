import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { RootState, AppDispatch } from "../store/store";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSingleGroup, fetchGroupMembers } from "../store/singleGroupSlice";
import { PendingGroupRequests } from "./PendingGroupRequests";
import {
  requestToJoinGroup,
  leaveGroup, groupMemberLeft, groupMemberRejoined,
  fetchingPendingRequests,
} from "../store/groupMembershipSlice";
import { logoutUser } from "../store/userSlice";



export const GroupPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groupId } = useParams<{ groupId: string }>();
  const numericGroupId = Number(groupId);

  if (isNaN(numericGroupId)) {
    console.error("Invalid group ID:", groupId);
    return <div>Error: Invalid group ID</div>;
  }

  const { user, tokenExpiresAt } = useSelector((state: RootState) => state.user);
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
    // if (isTokenExpired(tokenExpiresAt)) {
    //   toast.error("Your session has expired. Please log in again.");
    //   // dispatch(logoutUser()); // Log out the user
    //   // navigate("/login"); // Redirect user to login page
    // }

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

  // Check if user is already a member of the group
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
  
    if (!userId) return toast.error("Error: User not found");
    dispatch(groupMemberLeft(userId)); // Optimistically remove from UI
    toast.success("You have left the group.");
    await dispatch(leaveGroup(numericGroupId))
 

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
              {isAdmin && <p style={{color: "blue"}}>You are the admin of this group.</p>}
              {isMember && !isAdmin && <p style={{color: "green"}}>You are an approved member.</p>}
              {hasPendingRequest && (
                <p style={{color: "orange"}}>Your request to join is pending approval.</p>
              )}
              {!isMember && !hasPendingRequest && isUserLogged && !isAdmin && (
                <p style={{color: "red"}}>You are not a member yet.</p>
              )}
              {!isUserLogged && <p>Please log in to send a request.</p>}
            </div>

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
                <button
                  onClick={() => handleLeaveGroup(numericGroupId)}
                  className="btn-leave"
                >
                  Leave Group
                </button>
              )}

              {/* User is not a member - show "Join Group" button */}
              {isUserLogged && !isMember && !hasPendingRequest && !isAdmin && (
                <>
                  <button
                    onClick={() => handleRequestJoin(numericGroupId)}
                    className="btn-join"
                  >
                    Join {singleGroup.groupName}
                  </button>
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
