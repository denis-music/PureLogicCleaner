namespace pureLogicCleanerAPI.VMs
{
    public class SubscriptionsVM
    {
        public SubscriptionsVM(string name, double price, bool sensorsIncluded, int durationInDays, string description = "")
        {
            Name = name;
            Price = price;
            SensorsIncluded = sensorsIncluded;
            DurationInDays = durationInDays;
            Description = description;
        }

        public string? Name { get; set; } = null;
        public double? Price { get; set; } = null;
        public bool? SensorsIncluded { get; set; } = null;
        public int? DurationInDays { get; set; } = null;
        public string? Description { get; set; } = null;
    }

}
