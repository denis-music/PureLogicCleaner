import { CleaningFrequency } from "../enum/cleaningFrequency.enum";
import { DaysOfWeek } from "../enum/daysOfWeek.enum";

export class Habit {
    preferredCleaningDays: DaysOfWeek[] | null = null;
    preferredCleaningFrequency: number | null = null;
    priorityRoomIds: string[] | null = null;
    pets: boolean | null = null;
    allergies: boolean | null = null;

    constructor(
        preferredCleaningDays?: DaysOfWeek[] | null,
        preferredCleaningFrequency?: number | null,
        priorityRoomIds?: string[] | null,
        pets?: boolean | null,
        allergies?: boolean | null
    ) {
        if (preferredCleaningFrequency !== null && preferredCleaningFrequency !== undefined) {
            this.preferredCleaningFrequency = preferredCleaningFrequency;
        } else {
            this.preferredCleaningFrequency = null;
        }
        this.preferredCleaningDays = preferredCleaningDays || null;
        this.priorityRoomIds = priorityRoomIds || null;
        this.pets = pets || null;
        this.allergies = allergies || null;
    }
}
