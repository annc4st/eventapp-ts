import api from "../utils/api";
import { Event } from "../types";


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