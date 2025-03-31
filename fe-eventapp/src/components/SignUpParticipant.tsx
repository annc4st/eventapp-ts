import { RootState, AppDispatch } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { optimisticAdd, signUpForEvent } from "../store/participantSlice";
import Button from '@mui/material/Button';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { Box } from "@mui/material";

 

interface SignUpParticipantProps {
  eventId: number;
}

export const SignUpParticipant: React.FC<SignUpParticipantProps> = ({ eventId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const participants = useSelector((state: RootState) => state.participants.participants);

  if (!user) return null; // Prevent rendering if user is not logged in

  // check whether user has signed up
   let isAlreadySignedUp = participants.some((p) =>p.eventId == eventId && p.userId === user?.id);


    const handleSignUp = async ( ) => {
      if (isAlreadySignedUp) {
        alert('You are already signed up for this event.');
        return;
      }

    const tempId = Date.now(); // Generate a temporary unique ID
    const newParticipant = { id: tempId, eventId, userId: user.id  };

    dispatch(optimisticAdd(newParticipant));
    try {
      await dispatch(signUpForEvent(eventId));
       
    } catch (error) {
      console.error(error);
 
    }
  };

  return (
    <Box>
        <Button  variant="contained" size="large" 
        sx={{bgcolor: 'secondary.dark'}}
        onClick={handleSignUp} disabled={!user || isAlreadySignedUp} 
        startIcon={<DirectionsRunIcon />}
        >
           {isAlreadySignedUp ? 'Already Registered' : 'Sign Up'}
        </Button>
        </Box>
  );
};
