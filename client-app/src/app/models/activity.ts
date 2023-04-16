import { Profile } from "./profile";

export interface Activity {
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  isCancelled?: boolean;
  isHost?: boolean;
  isGoing?: boolean;
  hostUsername?: string;
  host?: Profile;
  attendees?: Profile[];
}
