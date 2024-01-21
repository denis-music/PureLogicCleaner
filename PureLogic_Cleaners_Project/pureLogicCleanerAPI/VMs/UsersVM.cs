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
        public bool Allergies { get; set; } = false;
        public bool? Pets { get; set; } = false;
        public List<DaysOfWeek> PreferredCleaningDays { get; set; } = null;
        public CleaningFrequency? PreferredCleaningFrequency { get; set; } = null;
        public List<string>? PriorityRoomIds { get; set; } = null;

        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string PasswordConfirm { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Adrress { get; set; } = string.Empty;
        public int? Age { get; set; } = null;

        public DateTime? SubscriptionDateBought { get; set; } = null;
    }
}
