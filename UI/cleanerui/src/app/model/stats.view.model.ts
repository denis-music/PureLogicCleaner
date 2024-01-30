export class StatsView {
    userRoomId!: string;
    roomId!: string;
    roomName!: string;

    constructor(userRoomId: string, roomId: string, roomName: string) {
        this.userRoomId = userRoomId;
        this.roomId = roomId;
        this.roomName = roomName;
    }
}