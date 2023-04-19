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

export class Activity implements Activity {
  constructor(activity?: ActivityFormValues) {
    Object.assign(this, activity);
  }
}

export class ActivityFormValues {
  id?: string = undefined;
  title: string = "";
  date: Date | null = null;
  description: string = "";
  category: string = "";
  venue: string = "";
  city: string = "";

  constructor(activity?: ActivityFormValues) {
    if (activity) {
      this.id = activity.id;
      this.title = activity.title;
      this.date = activity.date;
      this.description = activity.description;
      this.category = activity.category;
      this.venue = activity.venue;
      this.city = activity.city;
    }
  }
}
