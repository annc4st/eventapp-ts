import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { approveMember, fetchApprovedMembers, fetchPendingRequests} from "../store/groupMembershipSlice";
import { Button, IconButton, Stack, Tooltip, Typography, Container } from "@mui/material";
// import CancelIcon from '@mui/icons-material/Cancel';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router";
import { fetchSingleGroup  } from "../store/singleGroupSlice";


export const GroupAdmin = () => {

const {groupId} = useParams();
const numGroupId = parseInt(groupId || "", 10);
 const dispatch = useDispatch<AppDispatch>();
   const { user } = useSelector((state: RootState) => state.user);
 
 const pendingRequests = useSelector( (state: RootState) => state.groupMembership.pendingRequests );
 const { singleGroup } = useSelector((state: RootState) => state.singleGroup );
const [approvedIds, setApprovedIds] = useState<number[]>([]); 
const navigate = useNavigate();

useEffect(() => {
  if (numGroupId) {
    dispatch(fetchSingleGroup(numGroupId));
    dispatch(fetchPendingRequests(numGroupId));
  }
}, [dispatch, numGroupId])

useEffect(() => {
  if (singleGroup && user) {
    if (singleGroup.adminId !== user.id) {
      navigate("/unauthorized");
    }
  }
}, [singleGroup, user, navigate]);

if (!singleGroup || !user) {
  return <div>Unauth</div>
}

  const handleApprove = async (userId: number) => {
    setApprovedIds((prev) => [...prev, userId]);  
    try {
      await dispatch(approveMember({ groupId: numGroupId, userId })).unwrap();
      dispatch(fetchApprovedMembers(numGroupId)); 
    } catch (error){
      console.error("Failed to approve member:", error)
      // Optional: Remove from approvedIds if failed
      setApprovedIds((prev) => prev.filter((id) => id !== userId));
    }
  };

 

  return (
    <>
    
    <Container sx={{ mt: 6, mb: 4}}>
      <Typography variant="h4">Pending Requests</Typography>

      { pendingRequests.length === 0 && 
      <Typography mt={2} color="secondary.main"
        >No pending requests.</Typography>
      
      }


      {pendingRequests.map((request) => {
        const isApproved = approvedIds.includes(request.userId);

        return (
        <Stack key={request.userId}  spacing={3} direction="row" alignItems="flex-end" my={2} >
         
          <Typography sx={{color: "secondary.main"}}> User name : {request.user?.email.split('@')[0]}</Typography>

          {!isApproved ? (
            <Button 
           variant="outlined"
            sx={{ color: "primary.light"}}
            onClick={() => handleApprove(request.userId)}>
          Approve</Button>  
          ): (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
             <Tooltip title="Approved" 
             placement="right"
             >
                <IconButton sx={{color: "primary.light"}} >
                  <DoneOutlineIcon />
                </IconButton>
              </Tooltip>
              </motion.div>
          )}
        </Stack>
      )})}

   
</Container>
    </>
  );
};

 