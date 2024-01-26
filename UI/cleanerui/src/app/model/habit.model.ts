import { DaysOfWeek } from "../enum/daysOfWeek.enum";

export class Habit {
    preferredCleaningDays: DaysOfWeek[] | null = null;
    preferredCleaningFrequency: number | null = null;
    priorityRoomIds: string[] | null = null;
    pets: boolean = false;
    allergies: boolean = false;

    constructor(
        preferredCleaningDays?: DaysOfWeek[] | null,
        preferredCleaningFrequency?: number | null,
        priorityRoomIds?: string[] | null,
        pets: boolean = false,
        allergies: boolean = false
    ) {
        if (preferredCleaningFrequency !== null && preferredCleaningFrequency !== undefined) {
            this.preferredCleaningFrequency = preferredCleaningFrequency;
        } else {
            this.preferredCleaningFrequency = null;
        }
        this.preferredCleaningDays = preferredCleaningDays || null;
        this.priorityRoomIds = priorityRoomIds || null;
        this.pets = pets;
        this.allergies = allergies;
    }
}
