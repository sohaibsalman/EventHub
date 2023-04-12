export interface User {
  displayName: string;
  token: string;
  image: null;
  username: string;
}

export interface UserFormValues {
  email: string;
  password: string;
  displayName?: string;
  username?: string;
}
