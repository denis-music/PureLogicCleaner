export class StatsView {
    roomId!: string;
    roomName!: string;

    constructor(roomId: string, roomName: string) {
        this.roomId = roomId;
        this.roomName = roomName;
    }
}