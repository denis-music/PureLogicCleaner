import { RoomSize } from "../enum/roomSize.enum";
import { SurfaceType } from "../enum/surfaceType.enum";
import { UsageFrequency } from "../enum/usageFrequency.enum";

export class UserRoom {
    id?: string = '';
    userId?: string;
    roomId?: string;
    roomSize?: RoomSize;
    surfaceType?: SurfaceType;
    usageFrequency?: UsageFrequency;
    numberOfOccupants?: number;

    constructor(
        roomId: string,
        roomSize: RoomSize,
        surfaceType: SurfaceType,
        usageFrequency: UsageFrequency,
        numberOfOccupants: number
    ) {
        this.roomId = roomId;
        this.roomSize = roomSize;
        this.surfaceType = surfaceType;
        this.usageFrequency = usageFrequency;
        this.numberOfOccupants = numberOfOccupants;
    }
}
