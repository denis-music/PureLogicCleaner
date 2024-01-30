using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.Models
{
    public class CleaningHistory
    {
        public required string Id { get; set; }
        public required string UserRoomId { get; set; }
        public required bool Completed { get; set; } = false;
        public CleaningQuality? CleaningQuality { get; set; } = null;
        public int? CleaningDurationInMins { get; set; } = null;
        public required DateTime Date { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
