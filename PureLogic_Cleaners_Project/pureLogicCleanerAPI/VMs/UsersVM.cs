using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.Models
{
    public class UsersVM
    {
        public string Id { get; set; } = string.Empty;
        public string SubsId { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int Ages { get; set; }
        public Boolean Allergies { get; set; } = false;
        public Boolean Pets { get; set; } = false;
        public required List<DaysOfWeek> PreferredCleaningDays { get; set; }
        public required CleaningFrequency PreferredCleaningFrequency { get; set; }
        public required List<string> PriorityRoomIds { get; set; }
    }
}
