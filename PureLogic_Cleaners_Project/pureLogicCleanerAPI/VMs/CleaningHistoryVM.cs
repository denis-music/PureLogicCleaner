using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.VMs
{
    public class CleaningHistoryVM
    {
        public string? UserRoomId { get; set; } = null;
        public bool? Completed { get; set; } = null;
        public CleaningQuality? CleaningQuality { get; set; } = null;
        public int? CleaningDurationInMins { get; set; } = null;
        public DateTime? Date { get; set; } = null;
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; } = null;
    }
}
