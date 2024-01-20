using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.VMs.Requests
{
    public class FeedbacksSearchRequest
    {
        public string? MemberId { get; set; } = null;
        public string? CleaningScheduleId { get; set; } = null;
        public FeedbackType? FeedbackType { get; set; } = null;
        public int? Rating { get; set; } = null;
        public DateTime? DateSubmitted { get; set; } = null; 
    }
}
