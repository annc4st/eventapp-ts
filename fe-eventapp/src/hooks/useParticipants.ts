import { useQuery } from "@tanstack/react-query";
import { getParticipants } from "../services/participantService";

interface Participant {
    id: number;
    eventId: number;
    userId: number;
    user: {
        id: number;
        email: string;
    };
}

export const useParticipants = (eventId: number) => {
  return useQuery<Participant []>({ 
    queryKey: ["participants", eventId], 
    queryFn: () => getParticipants(eventId),
});
};