namespace pureLogicCleanerAPI.Models
{
    public class Rooms
    {
        public required string Id { get; set; } = string.Empty;
        public required string Name { get; set; } = string.Empty; // label
        public required string CustomName { get; set; } = string.Empty; // custom name
    }
}
