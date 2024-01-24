using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.VMs.Requests
{
    public class UserHabitsUpsertRequest
    {
        public required List<DaysOfWeek>? PreferredCleaningDays { get; set; }
        public required CleaningFrequency? PreferredCleaningFrequency { get; set; }
        public required List<string>? PriorityRoomIds { get; set; }
        public required bool? Pets { get; set; }
        public required bool? Allergies { get; set; }
    }
}
