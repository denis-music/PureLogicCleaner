import { CleaningQuality } from "../enum/cleaningQuality.enum";

export class CleaningHistoryWithName {
    id!: string;
    userRoomId!: string;
    userRoomName!: string;
    completed!: boolean;
    cleaningQuality!: CleaningQuality;
    cleaningDurationInMins!: number;
    date!: Date;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(
        id: string,
        userRoomId: string,
        userRoomName: string,
        completed: boolean,
        cleaningQuality: CleaningQuality,
        cleaningDurationInMins: number,
        date: Date,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.id = id;
        this.userRoomId = userRoomId;
        this.userRoomName = userRoomName;
        this.completed = completed;
        this.cleaningQuality = cleaningQuality;
        this.cleaningDurationInMins = cleaningDurationInMins;
        this.date = date;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}