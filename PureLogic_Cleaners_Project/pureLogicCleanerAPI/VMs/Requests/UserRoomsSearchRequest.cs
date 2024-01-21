using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.VMs.Requests
{
    public class UserRoomsSearchRequest
    {
        public string? UserId { get; set; } = null;
        public string? RoomId { get; set; } = null;
        public RoomSize? RoomSize { get; set; } = null;
        public SurfaceType? SurfaceType { get; set; } = null;
        public UsageFrequency? UsageFrequency { get; set; } = null;
    }
}
