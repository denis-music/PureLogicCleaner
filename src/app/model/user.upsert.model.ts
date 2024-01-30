export class UserUpsert {
    firstName?: string;
    lastName?: string;
    username?: string;
    password?: string;
    passwordConfirm?: string;
    email?: string;
    age?: number;
  
    constructor(data: Partial<UserUpsert>) {
      Object.assign(this, data);
    }
  }