import api from "../utils/api";
import store from "../store/store";

export const getParticipants = async (eventId: number): Promise<any[]> => {
  try {
    const response = await api.get(`/events/${eventId}/participants`);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        `Failed to fetch participants for event ${eventId}`,
    );
  }
};

export const addParticipant = async (
  eventId: number,
  userId: number,
): Promise<void> => {
  try {
    const token = store.getState().user.token;
    if (!token) {
      throw new Error("Unauthorized");
    }

    await api.post(`/events/${eventId}/participants`, 
        {}, 
        {
      headers: { Authorization: `Bearer ${token}` },
    }
);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || `Failed to sign up for event ${eventId}`,
    );
  }
};