import { User } from "./user";

export interface Profile {
  username: string;
  displayName: string;
  bio?: string;
  image?: string;
  followingsCount: number;
  followersCount: number;
  following: boolean;
  photos?: Photo[];
}

export class Profile implements Profile {
  constructor(user: User) {
    this.username = user.username;
    this.displayName = user.displayName;
    this.image = user.image!;
  }
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}