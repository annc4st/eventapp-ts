import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import Button from '@mui/material/Button';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { Box } from "@mui/material";
import { useParticipants } from "../hooks/useParticipants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addParticipant } from "../services/participantService";
import { Participant } from "../types";

interface SignUpParticipantProps {
  eventId: number;
}

export const SignUpParticipant: React.FC<SignUpParticipantProps> = ({ eventId }) => {

  const { user } = useSelector((state: RootState) => state.user);
  const { data: participants = [] } = useParticipants(eventId);
  
  if (!user) return null;
  
  let isAlreadySignedUp = false;
  if (participants && participants.length > 0) {
    
    isAlreadySignedUp = participants.some((p) => p.eventId == eventId && p.userId === user?.id);
  }
  
  console.log(`isAlreadySignedUp eventid ${eventId} >> `, isAlreadySignedUp)
  
  // non optimistic update
  // const queryClient = useQueryClient();
  //  const addParticipantMutation = useMutation({
  //   mutationFn: () => addParticipant(eventId, user?.id), // API call

  //   onMutate: async () => {
  //     await queryClient.cancelQueries({ queryKey: ["participants", eventId] });
  //  }
  //  } );


  /// optimistic update with react query
  const useSignUpForEvent = (eventId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: () => addParticipant(eventId, user?.id), // API call

      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["participants", eventId] });

        const previous = queryClient.getQueryData<Participant[]>([
          "participants",
          eventId,
        ]);

        const tempParticipant: Participant = {
          id: Date.now(),
          eventId,
          userId: user?.id, // ← replace with real user.id
          user: {
            id: user?.id || 0, // ← replace with real user.id
            email: "temp@email.com",
          },
        };

        queryClient.setQueryData<Participant[]>(
          ["participants", eventId],
          (old = []) => [tempParticipant, ...old]
        );

        return { previous };
      },

      onError: (_err, _vars, context) => {
        queryClient.setQueryData(
          ["participants", eventId],
          context?.previous
        );
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["participants", eventId] });
      },
    });
  };

  const signUpMutation = useSignUpForEvent(eventId);

  const handleSignUp = () => {
    if (isAlreadySignedUp) {
      alert("You are already signed up for this event.");
      return;
    }
    try {
      // addParticipantMutation.mutate();
      signUpMutation.mutate();
      console.log("Sign-up successful");
    } catch (error) {
      console.error("Error signing up for event:", error);
    }
  };

  return (
    <Box>
      <Button variant="contained" size="large"
        sx={{ bgcolor: 'secondary.dark' }}
        onClick={handleSignUp} disabled={!user || isAlreadySignedUp || signUpMutation.isPending}
        startIcon={<DirectionsRunIcon />}
      >
        {isAlreadySignedUp ? 'Registered' : 'Sign Up'}
      </Button>
    </Box>
  );
};
