import api from "../utils/api";
import { Comment} from "../types";
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