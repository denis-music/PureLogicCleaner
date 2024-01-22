using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.VMs
{
    public class FeedbacksVM
    {
        public string? MemberId { get; set; } = null;
        public string? CleaningHistoryId { get; set; } = null;
        public FeedbackType? FeedbackType { get; set; } = null;
        public int? Rating { get; set; } = null;
        public string? Text { get; set; } = null;
    }
}
