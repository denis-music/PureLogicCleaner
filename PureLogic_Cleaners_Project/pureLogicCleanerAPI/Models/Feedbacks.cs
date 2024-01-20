using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.Models
{
    public class Feedbacks
    {
        public required string Id { get; set; }
        public required int MemberId { get; set; }
        public required int CleaningScheduleId { get; set; }
        public required FeedbackType FeedbackType { get; set; }
        public required int Rating { get; set; }
        public DateTime DateSubmitted { get; set; } = DateTime.Now;
        public string? Text { get; set; }
    }
}
