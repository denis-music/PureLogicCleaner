using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.VMs.Requests
{
    public class CleaningHistorySearchRequest
    {
        public string? UserRoomId { get; set; } = null;
        public bool? Completed { get; set; } = null;
        public CleaningQuality? CleaningQuality { get; set; } = null;
    }
}
