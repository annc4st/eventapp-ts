export interface Participant {
    id: number;
    eventId: number;
    userId: number;
    user: {
        id: number;
        email: string;
    };
}