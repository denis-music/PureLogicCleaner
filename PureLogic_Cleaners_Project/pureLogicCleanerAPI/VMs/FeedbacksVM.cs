using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.VMs
{
    public class FeedbacksVM
    {
        public required string MemberId { get; set; }
        public required string CleaningScheduleId { get; set; }
        public required FeedbackType FeedbackType { get; set; }
        public required int Rating { get; set; }
        public string? Text { get; set; }
    }
}
