import { CleaningFrequency } from "../enum/cleaningFrequency.enum";
import { DaysOfWeek } from "../enum/daysOfWeek.enum";

export class User {
  id: string = '';
  subsId: string = '';
  firstName: string = '';
  lastName: string = '';
  preferredCleaningDays: DaysOfWeek[] = [];
  preferredCleaningFrequency: CleaningFrequency;
  priorityRoomIds: string[] = [];
  pets: boolean = false;
  allergies: boolean = false;

  username: string = '';
  passwordHash: string = '';
  passwordSalt: string = '';
  email: string = '';
  address: string = '';
  age: number = 0;

  subscriptionDateBought: Date | null = null;

  constructor(
    id: string,
    subsId: string,
    firstName: string,
    lastName: string,
    preferredCleaningDays: DaysOfWeek[],
    preferredCleaningFrequency: CleaningFrequency,
    priorityRoomIds: string[],
    pets: boolean,
    allergies: boolean,
    username: string,
    passwordHash: string,
    passwordSalt: string,
    email: string,
    address: string,
    age: number,
    subscriptionDateBought: Date | null
  ) {
    this.id = id;
    this.subsId = subsId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.preferredCleaningDays = preferredCleaningDays;
    this.preferredCleaningFrequency = preferredCleaningFrequency;
    this.priorityRoomIds = priorityRoomIds;
    this.pets = pets;
    this.allergies = allergies;
    this.username = username;
    this.passwordHash = passwordHash;
    this.passwordSalt = passwordSalt;
    this.email = email;
    this.address = address;
    this.age = age;
    this.subscriptionDateBought = subscriptionDateBought;
  }
}
