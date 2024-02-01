namespace pureLogicCleanerAPI.Models.Enums
{
    public enum SubscirptionNames
    {
        FreeTrial,
        Monthly,
        Annual,
        Premium
    }

    public static class SubscirptionNamesExtensions
    {
        public static string ToFriendlyString(this SubscirptionNames size)
        {
            switch (size)
            {
                case SubscirptionNames.FreeTrial:
                    return "Free Trial";
                case SubscirptionNames.Monthly:
                    return "Monthly";
                case SubscirptionNames.Annual:
                    return "Annual";
                case SubscirptionNames.Premium:
                    return "Premium";
                default:
                    throw new ArgumentOutOfRangeException(nameof(size), size, null);
            }
        }
    }
}
