using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.VMs.Requests
{
    public class FeedbacksSearchRequest
    {
        public string? MemberId { get; set; }
        public string? CleaningScheduleId { get; set; }
        public FeedbackType? FeedbackType { get; set; }
        public int? Rating { get; set; }
        public DateTime? DateSubmitted { get; set; }
    }
}
