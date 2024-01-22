import { CleaningQuality } from "../enum/cleaningQualityEnum.model";

export class CleaningHistory {
    id!: string;
    userRoomId!: string;
    completed!: boolean;
    cleaningQuality!: CleaningQuality;
    cleaningDurationInMins!: number;
    date!: Date;
    createdAt?: Date;
    updatedAt?: Date;
    
}