import { makeAutoObservable, runInAction } from "mobx";

import agent from "../api/agent";
import { store } from "./store";
import { Photo, Profile } from "../models/profile";

export class ProfileStore {
  profile: Profile | null = null;
  loadingProfile: boolean = false;
  uploading = false;
  loading = false;
  followings: Profile[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }
    return false;
  }

  loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => (this.profile = profile));
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loadingProfile = false));
    }
  };

  uploadPhoto = async (file: Blob) => {
    this.uploading = true;
    try {
      const response = await agent.Profiles.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
          }
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.uploading = false));
    }
  };

  setMain = async (photo: Photo) => {
    this.loading = true;
    try {
      await agent.Profiles.setMain(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile && this.profile.photos) {
          this.profile.photos.find((x) => x.isMain)!.isMain = false;
          this.profile.photos.find((x) => x.id === photo.id)!.isMain = true;
          this.profile.image = photo.url;
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  deletePhoto = async (id: string) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile?.photos?.filter(
            (x) => x.id !== id
          );
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  updateProfile = async (profileForm: Partial<Profile>) => {
    try {
      await agent.Profiles.updateProfile(profileForm);
      store.userStore.setDisplayName(profileForm.displayName!);
      runInAction(() => {
        if (this.profile) {
          this.profile = { ...this.profile, ...profileForm };
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateFollowing = async (username: string, following: boolean) => {
    this.loading = true;

    try {
      await agent.Profiles.updateFollowing(username);
      store.activityStore.updateAttendeeFollowing(username);
      runInAction(() => {
        if (
          this.profile &&
          this.profile.username !== store.userStore.user?.username
        ) {
          following
            ? this.profile.followersCount++
            : this.profile.followersCount--;
          this.profile.following = !this.profile.following;
        }
        this.followings.forEach((profile) => {
          if (this.profile?.username === username) {
            profile.following
              ? profile.followersCount--
              : profile.followersCount++;
            profile.following = !profile.following;
          }
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };
}
