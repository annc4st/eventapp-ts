import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { RootState, AppDispatch } from "../store/store";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSingleGroup, fetchGroupMembers } from "../store/singleGroupSlice";
 

import { fetchApprovedMembers, requestToJoinGroup, leaveGroup,
  fetchPendingRequests } from "../store/groupMembershipSlice";
import { logoutUser } from "../store/userSlice";
import { GroupNewsList } from "./GroupNewsList";
// import {selectPendingRequests} from '../store/groupMembershipSlice'
 

import { Box,  Container, styled, CardHeader, Card, Avatar,
 Typography, Button, AlertTitle, Alert, 
  Stack} from "@mui/material";
import { Link } from "react-router-dom";
import { NotFoundGroupPage } from "./NotFoundGroupPage";



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

  const { singleGroup, members, loadingGroup, loadingMembers, error } = useSelector(
    (state: RootState) => state.singleGroup
  );
 
  const { pendingRequests, approvedMembers } = useSelector((state: RootState) => state.groupMembership);
 

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
      dispatch(fetchPendingRequests(numericGroupId));
    }
  }, [dispatch, tokenExpiresAt, numericGroupId]);


  if(!loadingGroup && !singleGroup){
    return <NotFoundGroupPage />
  }


 
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
    dispatch(fetchPendingRequests(numericGroupId)); //   update pending requests
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
      // alert("Failed to leave the group.");
      <Alert severity="warning">Failed to leave the group.</Alert>

    } finally {
      setIsLeaving(false);
    }
  };


  const renderUserStatus = () => {
    if (!isUserLogged) {
      return <Typography sx={{color: "text.primary"}}>Please log in.</Typography>;
    }
  
    if (leaveSuccess) {
      return <Typography sx={{color: "text.primary"}}>You have left the group</Typography>;
    }
  
    if (isAdmin) {
      return <Typography sx={{color: "text.primary"}}>Admin</Typography>;
    }
  
    if (isMember && !leaveSuccess) {
      return <Typography sx={{color: "text.primary"}}>Approved</Typography>;
    }
  
    if (hasPendingRequest) {
      return <Typography sx={{color: "text.primary"}}>Pending approval</Typography>;
    }
  
    return <Typography sx={{color: "text.primary"}}>You are not a member.</Typography>;
  };

  if (loadingGroup) return <div>Loading...</div>;
  if (error){
    return ( <Alert severity="error">
      <AlertTitle>Error</AlertTitle>{error}
      </Alert>
  )}


  return (
    <> 
      <Container>
        {singleGroup && (
          <>
          <Box sx={{justifyItems: "center", mb: 2}} >
            <Typography variant='h3' sx={{ my: 2, color: "secondary.main"}}>{singleGroup.groupName}</Typography>
            <Typography sx={{color: 'text.secondary'}}>{singleGroup.description}</Typography>
            <Typography sx={{color: 'primary.main', mt: 2}}>Number of active members: {members.length}</Typography>
            </Box>

            <Stack direction="row" spacing={2} mb={2}>
              <Typography sx={{color: "text.secondary"}}>Your status:</Typography>
              {renderUserStatus()}
            </Stack>

              {/* User left */}

            {/* Action Buttons */}
            <div className="group-actions">
              {/* USer should be logged in */}
              {!isUserLogged && (
                <Link to={`/login`}><Button  
                sx={{backgroundColor: "primary.main", color: "secondary.main"}}
                >
                  {" "}
                  To login
                </Button></Link>
              )}

      {/* User is the admin */}
      {/* for admin eyes only - sends  to admin page */}
              {isAdmin &&  (
                <Link to={`/groups/${groupId}/admin`}>
                  <Button size="medium">Go to Admin page</Button>
                </Link>
              )}

              {/*  User is a member - show "Leave Group" button */}
              {isMember && !isAdmin && (
                <Button variant="outlined"
                  onClick={() => handleLeaveGroup(numericGroupId)}
         
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
                <Button disabled>
                  Your request to join is pending
                </Button>
              )}
            </div>
              <GroupNewsList groupId = {numericGroupId} />
          </>
        )}
      </Container>
    </>
  );
};
