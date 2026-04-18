import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../services/eventService";
import { Event } from "../types";

export const useEvents = () => {
  return useQuery<Event[]>({ 
    queryKey: ["events"], 
    queryFn: getEvents 
});
};