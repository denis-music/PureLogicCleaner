namespace pureLogicCleanerAPI.Models
{
    public class Subscriptions
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required double Price { get; set; }
        public required bool SensorsIncluded { get; set; }
        public required int DurationInDays { get; set; }
        public string? Description { get; set; }
    }
}
