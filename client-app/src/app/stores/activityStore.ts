import { makeAutoObservable, runInAction } from "mobx";
import { v4 as uuid } from "uuid";

import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
  activitiesRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined;
  editMode = false;
  loading = false;
  loadingInitial = true;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activitiesRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  loadActivities = async () => {
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        this.setActivity(activity);
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.setLoadingInitial(false);
    }
  };

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
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };

  setSelectedActivity = (state: Activity) => {
    this.selectedActivity = state;
  };

  createActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      activity.id = uuid();
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activitiesRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.editMode = false;
        this.loading = false;
      });
    }
  };

  updateActivity = async (activity: Activity) => {
    this.loading = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activitiesRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.editMode = false;
        this.loading = false;
      });
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

  private getActivity(id: string) {
    return this.activitiesRegistry.get(id);
  }

  private setActivity(activity: Activity) {
    activity.date = activity.date.split("T")[0];
    this.activitiesRegistry.set(activity.id, activity);
  }
}
