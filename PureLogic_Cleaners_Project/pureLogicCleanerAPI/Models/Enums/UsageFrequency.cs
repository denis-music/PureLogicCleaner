namespace pureLogicCleanerAPI.Models.Enums
{
    public enum UsageFrequency
    {
        Low,
        Medium,
        High
    }

    public static class UsageFrequencyExtensions
    {
        public static string ToFriendlyString(this UsageFrequency size)
        {
            switch (size)
            {
                case UsageFrequency.Low:
                    return "Low";
                case UsageFrequency.Medium:
                    return "Medium";
                case UsageFrequency.High:
                    return "High";
                default:
                    throw new ArgumentOutOfRangeException(nameof(size), size, null);
            }
        }
    }
}
