import { useQuery } from "@tanstack/react-query";
import { getCommentsByEventId } from "../services/commentService";
import { Comment } from "../types";


export const useComments = (eventId: number) => {
  return useQuery<Comment[]>({ 
    queryKey: ["comments", eventId], 
    queryFn: () => getCommentsByEventId(eventId)
});
};