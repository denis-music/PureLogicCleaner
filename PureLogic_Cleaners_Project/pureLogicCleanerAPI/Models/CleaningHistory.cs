using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.Models
{
    public class CleaningHistory
    {
        public required string Id { get; set; }
        public required string UserRoomId { get; set; }
        public required bool Completed { get; set; } = false;
        public required CleaningQuality CleaningQuality { get; set; }
        public required int CleaningDurationInMins { get; set; }
        public required DateTime Date { get; set; }
        public required DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}
