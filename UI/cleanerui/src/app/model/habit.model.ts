import { CleaningFrequency } from "../enum/cleaningFrequency.enum";
import { DaysOfWeek } from "../enum/daysOfWeek.enum";

export class Habit {
    preferredCleaningDays: DaysOfWeek[] | null = null;
    preferredCleaningFrequency: CleaningFrequency | null = null;
    priorityRoomIds: string[] | null = null;
    pets: boolean | null = null;
    allergies: boolean | null = null;

    constructor(
        preferredCleaningDays?: DaysOfWeek[] | null,
        preferredCleaningFrequency?: CleaningFrequency | null,
        priorityRoomIds?: string[] | null,
        pets?: boolean | null,
        allergies?: boolean | null
    ) {
        this.preferredCleaningDays = preferredCleaningDays || null;
        this.preferredCleaningFrequency = preferredCleaningFrequency || null;
        this.priorityRoomIds = priorityRoomIds || null;
        this.pets = pets || null;
        this.allergies = allergies || null;
    }
}
