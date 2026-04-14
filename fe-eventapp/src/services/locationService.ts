import api from "../utils/api";

export interface Location {
  id: number;
    firstLine:  string;
    city:      string;
    postcode:  string;
}

export const getLocations = async() : Promise<Location []> => {
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