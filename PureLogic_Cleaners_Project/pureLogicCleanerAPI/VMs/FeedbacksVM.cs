using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.VMs
{
    public class FeedbacksVM
    {
        public required int MemberId { get; set; }
        public required int CleaningScheduleId { get; set; }
        public required FeedbackType FeedbackType { get; set; }
        public required int Rating { get; set; }
        public string? Text { get; set; }
    }
}
