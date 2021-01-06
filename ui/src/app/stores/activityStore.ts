import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import agent from '../../api/agent';
import { IActivity } from '../models/activity';

class ActivityStore {
  activities: IActivity[] = [];
  loadingInitial = false;
  selectedActivity: IActivity | undefined;
  editMode = false;
  submitting = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      activities.forEach((activity) => {
        activity.date = activity.date.split('.')[0];
        this.activities.push(activity);
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.loadingInitial = false;
    }
  };

  createActivity = async (activity: IActivity) => {
    this.submitting = true;

    try {
      await agent.Activities.create(activity);
      this.activities.push(activity);
    } catch (error) {
      console.log(error);
    } finally {
      this.editMode = false;
      this.submitting = false;
    }
  };

  openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  selectActivity = (id: string) => {
    this.selectedActivity = this.activities.find((a) => a.id === id);
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
