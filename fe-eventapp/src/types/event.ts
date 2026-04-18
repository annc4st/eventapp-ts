
export interface Event {
    id: number;
    name: string;
    distance?: number;
    ticketPrice?: number;
    date: string;
    location: {
        locationId: number;
        firstLine: string;
        city: string;
        postcode: string;
        latitude: number;
        longitude: number;
    }
    userId?: number;
}