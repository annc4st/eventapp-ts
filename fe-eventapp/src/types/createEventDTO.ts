export interface CreateEventDto {
  name: string;
  date: string;
  distance?: number;
  ticketPrice?: number;
  locationId: number;
  userId: number | undefined;
}