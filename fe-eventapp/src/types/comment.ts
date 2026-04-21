export interface Comment {
    id: number;
    createdAt: string | number | Date;
  content: string;
  eventId: number;
  userId: number; 
  authorName: string;
}