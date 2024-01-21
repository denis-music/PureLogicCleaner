using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.Models
{
    public class UserRoomsVM
    {
        public string? UserId { get; set; } = null;
        public string? RoomId { get; set; } = null;
        public RoomSize? RoomSize { get; set; } = null;
        public SurfaceType? SurfaceType { get; set; } = null;
        public UsageFrequency? UsageFrequency { get; set; } = null;
        public int? NumberOfOccupants { get; set; } = null;
    }
}
