export interface User {
  id: number;
  name: string;
  email: string;
}

export const users: User[] = [];

export const db = {
  users,
};
