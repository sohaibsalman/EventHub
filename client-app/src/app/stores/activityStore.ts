import { format } from "date-fns";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import { v4 as uuid } from "uuid";

import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {
  activitiesRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined;
  editMode = false;
  loading = false;
  loadingInitial = false;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();
  predicate = new Map().set("all", true);

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.predicate.keys(),
      () => {
        this.pagingParams = new PagingParams();
        this.activitiesRegistry.clear();
      }
    );
  }

  get activitiesByDate() {
    return Array.from(this.activitiesRegistry.values()).sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    );
  }

  get groupedActivities() {
    return Object.entries(
      this.activitiesByDate.reduce((activities, activity) => {
        const date = format(activity.date!, "dd MMM yyyy");
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: Activity[] })
    );
  }

  loadActivities = async (isLoading: boolean = true) => {
    if (isLoading) this.loadingInitial = true;
    try {
      const result = await agent.Activities.list(this.axiosParams);
      result.data.forEach((activity) => {
        this.setActivity(activity);
        this.setPagination(result.pagination);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loadingInitial = false));
    }
  };

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  setPagingParams = (pagingParams: PagingParams) => {
    this.pagingParams = pagingParams;
  };

  setPredicate = (predicate: string, value: string | Date) => {
    const resetPredicate = () => {
      this.predicate.forEach((val, key) => {
        if (key !== "startDate") this.predicate.delete(key);
      });
    };

    if (predicate === "startDate") {
      this.predicate.delete("startDate");
      this.predicate.set("startDate", value);
    } else {
      resetPredicate();
      this.predicate.set(predicate, value);
    }
  };

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("pageNumber", this.pagingParams.pageNumber.toString());
    params.append("pageSize", this.pagingParams.pageSize.toString());
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, (value as Date).toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) this.selectedActivity = activity;
    else {
      this.setLoadingInitial(true);
      try {
        activity = await agent.Activities.details(id);
        this.setActivity(activity);
        this.setSelectedActivity(activity);
      } catch (error) {
        console.log(error);
      } finally {
        this.setLoadingInitial(false);
      }
    }
    return activity;
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  setSelectedActivity = (state: Activity) => {
    this.selectedActivity = state;
  };

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    try {
      activity.id = uuid();
      await agent.Activities.create(activity);
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user?.username;
      newActivity.attendees = [attendee];
      this.setActivity(newActivity);
      runInAction(() => {
        this.selectedActivity = newActivity;
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          let updatedActivity = {
            ...this.getActivity(activity.id),
            ...activity,
          };
          this.setActivity(updatedActivity as Activity);
          this.selectedActivity = updatedActivity as Activity;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteActivity = async (id: string) => {
    this.loading = true;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activitiesRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateAttendance = async () => {
    const user = store.userStore.user;
    this.loading = true;

    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees =
            this.selectedActivity.attendees?.filter(
              (x) => x.username !== user?.username
            );
          this.selectedActivity.isGoing = false;
        } else {
          const attendee = new Profile(user!);
          this.selectedActivity?.attendees?.push(attendee);
          this.selectedActivity!.isGoing = true;
        }
        this.activitiesRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  cancelActivity = async () => {
    this.loading = true;
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled =
          !this.selectedActivity?.isCancelled;
        this.activitiesRegistry.set(
          this.selectedActivity!.id,
          this.selectedActivity!
        );
      });
    } catch (error) {
    } finally {
      runInAction(() => (this.loading = false));
    }
  };

  private getActivity(id: string) {
    return this.activitiesRegistry.get(id);
  }

  private setActivity(activity: Activity) {
    activity.date = new Date(activity.date!);
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees?.some(
        (x) => x.username === user.username
      );
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(
        (x) => x.username === activity.hostUsername
      );
    }
    this.activitiesRegistry.set(activity.id, activity);
  }

  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  updateAttendeeFollowing = (username: string) => {
    this.activitiesRegistry.forEach((activity) => {
      activity.attendees?.forEach((attendee) => {
        if (attendee.username === username) {
          attendee.following
            ? attendee.followersCount--
            : attendee.followersCount++;
          attendee.following = !attendee.following;
        }
      });
    });
  };
}
