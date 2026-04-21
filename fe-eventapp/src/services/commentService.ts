import api from "../utils/api";
import { Comment, CommentDto} from "../types";
import store from "../store/store";

export const getCommentsByEventId = async (eventId: number): Promise<Comment[]> => {
  try {
    const response = await api.get(`/events/${eventId}/comments`);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || `Failed to fetch comments for event ${eventId}`
    );
  }
}

export const createCommentService = async (commentData: CommentDto): Promise<Comment> => {

    console.log("Creating comment with data:", commentData);
    try {
        const token = store.getState().user.token;
    if (!token) {
        throw new Error("Unauthorized");
      }
    const response = await api.post(
      `/events/${commentData.eventId}/comments`, 
      commentData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Comment created:", response.data);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error posting comment:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to create comment"
    );  
  }
}