export class RoomDate {
    userRoomId!: string;
    userRoomName!: string;
    cleaningHistoryId!: string;
    cleaningDate!:Date;

    constructor(userRoomId: string, userRoomName: string, cleaningHistoryId: string, cleaningDate: Date) {
        this.userRoomId = userRoomId;
        this.cleaningHistoryId = cleaningHistoryId;
        this.cleaningDate = cleaningDate;
        this.userRoomName = userRoomName;
      }
}