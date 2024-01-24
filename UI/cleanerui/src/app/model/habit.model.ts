import { CleaningFrequency } from "../enum/cleaningFrequency.enum";
import { DaysOfWeek } from "../enum/daysOfWeek.enum";

export class Habit {
    preferredCleaningDays: DaysOfWeek[] | null = null;
    preferredCleaningFrequency: CleaningFrequency | null = null;
    priorityRoomIds: string[] | null = null;
    pets: boolean | null = null;
    allergies: boolean | null = null;
}
