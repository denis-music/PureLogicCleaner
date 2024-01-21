using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.Models
{
    public class Users
    {
        public required string Id { get; set; } = string.Empty;
        public required string SubsId { get; set; } = string.Empty;
        public required string FirstName { get; set; } = string.Empty;
        public required string LastName { get; set; } = string.Empty;
        public required int Ages { get; set; }
        public required List<DaysOfWeek> PreferredCleaningDays { get; set; }
        public required CleaningFrequency PreferredCleaningFrequency { get; set; }
        public required List<string> PriorityRoomIds { get; set; }
        public required bool Pets { get; set; }
        public required bool Allergies { get; set; }
    }
}
