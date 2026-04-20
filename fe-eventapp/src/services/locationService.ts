import api from "../utils/api";
import { EventLocation } from "../types";
import store from "../store/store";


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

export const createLocation = async (locationData: Omit<EventLocation, "id">): Promise<EventLocation> => {
    try {
        const token = store.getState().user.token;
        if (!token) {
            throw new Error("Unauthorized");
          }
        const response = await api.post(
            "/locations",
            locationData,
            { 
                  headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Failed to create location"
        );
    }
}