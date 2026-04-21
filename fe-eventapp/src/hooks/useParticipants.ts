import { useQuery } from "@tanstack/react-query";
import { getParticipants } from "../services/participantService";
import { Participant } from "../types";


export const useParticipants = (eventId: number) => {
  return useQuery<Participant []>({ 
    queryKey: ["participants", eventId], 
    queryFn: () => getParticipants(eventId),
});
};