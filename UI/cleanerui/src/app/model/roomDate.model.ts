export class RoomDate {
    userRoomId!: string;
    cleaningHistoryId!: string;
    cleaningDate!:Date;

    constructor(userRoomId: string, cleaningHistoryId: string, cleaningDate: Date) {
        this.userRoomId = userRoomId;
        this.cleaningHistoryId = cleaningHistoryId;
        this.cleaningDate = cleaningDate;
      }
}