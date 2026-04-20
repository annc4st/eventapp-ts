import api from "../utils/api";
import { Event, CreateEventDto} from "../types";
import store from "../store/store";


export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await api.get("/events");
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch events"
    );
  }
};

export const getSingleEvent = async (id: number): Promise<Event> => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || `Failed to fetch ${id} event`
    );
  }
};

export const getParticipants = async (eventId: number): Promise<any[]> => {
  try {
    const response = await api.get(`/events/${eventId}/participants`);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || `Failed to fetch participants for event ${eventId}`
    );
  }
};

export const createEventService = async (eventData: CreateEventDto): Promise<Event> => {
  try {
    
    const token = store.getState().user.token;
    if (!token) {
        throw new Error("Unauthorized");
      }
    const response = await api.post(
      "/events", 
      eventData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error posting event:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Failed to create event"
    );  
  }
}