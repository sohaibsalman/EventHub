import { makeAutoObservable } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";

export default class UserStore {
  private user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (userForm: UserFormValues) => {
    try {
      const user = await agent.Users.login(userForm);
      this.user = user;
    } catch (error) {
      throw error;
    }
  };
}
