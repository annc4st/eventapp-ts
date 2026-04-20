import { useQuery } from "@tanstack/react-query";
import { getSingleEvent } from "../services/eventService";

export const useSingleEvent = (id: number) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getSingleEvent(id),
  });
}

