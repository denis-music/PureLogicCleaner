using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.Models
{
    public class Users
    {
        public required string Id { get; set; } = string.Empty;
        public required string SubsId { get; set; } = string.Empty;
        public required string FirstName { get; set; } = string.Empty;
        public required string LastName { get; set; } = string.Empty;
        public required List<DaysOfWeek> PreferredCleaningDays { get; set; }
        public required CleaningFrequency PreferredCleaningFrequency { get; set; }
        public required List<string> PriorityRoomIds { get; set; }
        public required bool Pets { get; set; }
        public required bool Allergies { get; set; }

        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string PasswordSalt { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Adrress { get; set; } = string.Empty;
        public int Age { get; set; }

        public DateTime? SubscriptionDateBought { get; set; } = null;
    }
}
