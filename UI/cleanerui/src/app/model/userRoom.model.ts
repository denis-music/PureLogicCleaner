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
}
