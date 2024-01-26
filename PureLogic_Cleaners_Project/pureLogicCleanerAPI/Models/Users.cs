using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.Models
{
    public class Users
    {
        public required string Id { get; set; } = string.Empty;
        public required string SubsId { get; set; } = string.Empty;
        public required string FirstName { get; set; } = string.Empty;
        public required string LastName { get; set; } = string.Empty;

        // data for AI
        public List<DaysOfWeek>? PreferredCleaningDays { get; set; } = null;
        public CleaningFrequency? PreferredCleaningFrequency { get; set; } = null;
        public List<string>? PriorityRoomIds { get; set; } = null;
        public bool? Pets { get; set; } = false;
        public bool? Allergies { get; set; } = false;

        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string PasswordSalt { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Adrress { get; set; } = string.Empty;
        public int Age { get; set; }

        public DateTime? SubscriptionDateBought { get; set; } = null;
    }
}
