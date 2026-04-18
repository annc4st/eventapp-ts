import api from "../utils/api";
import { EventLocation } from "../types/eventLocation";


export const getLocations = async (): Promise<EventLocation[]> => {
    try {
        const response = await api.get("/locations");
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to fetch locations"
        );
    }
};