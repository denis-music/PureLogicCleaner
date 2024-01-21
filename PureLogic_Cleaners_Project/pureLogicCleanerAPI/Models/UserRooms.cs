using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.Models
{
    public class UserRooms
    {
        public required string Id { get; set; } = string.Empty;
        public required string UserId { get; set; }
        public required string RoomId { get; set; }
        public required RoomSize RoomSize { get; set; }
        public required SurfaceType SurfaceType { get; set; }
        public required UsageFrequency UsageFrequency { get; set; }
        public required int NumberOfOccupants { get; set; }
    }
}
