import api from "../utils/api";

export interface Event {
  id: number;
  name: string;
  distance?: number;
  ticketPrice?: number;
  date: string;
  locationId: number;
  userId?: number;
}

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