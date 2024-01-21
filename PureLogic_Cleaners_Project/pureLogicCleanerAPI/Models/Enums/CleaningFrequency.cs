namespace pureLogicCleanerAPI.Models.Enums
{
    public enum CleaningFrequency
    {
        Daily,
        EveryThreeDays,
        TwiceAWeek,
        Weekly,
        Fortnightly,
        BiWeekly,
        TwiceAMonth,
        Monthly,
        BiMonthly,
        Quarterly,
        Seasonally,
        Yearly,
        AsNeeded
    }

    public static class CleaningFrequencyExtensions
    {
        public static string ToFriendlyString(this CleaningFrequency frequency)
        {
            switch (frequency)
            {
                case CleaningFrequency.Daily:
                    return "Daily";
                case CleaningFrequency.EveryThreeDays:
                    return "Every 3 Days";
                case CleaningFrequency.TwiceAWeek:
                    return "Twice a Week";
                case CleaningFrequency.Weekly:
                    return "Weekly";
                case CleaningFrequency.Fortnightly:
                    return "Fortnightly";
                case CleaningFrequency.BiWeekly:
                    return "Bi-Weekly";
                case CleaningFrequency.TwiceAMonth:
                    return "Twice a Month";
                case CleaningFrequency.Monthly:
                    return "Monthly";
                case CleaningFrequency.BiMonthly:
                    return "Bi-Monthly";
                case CleaningFrequency.Quarterly:
                    return "Quarterly";
                case CleaningFrequency.Seasonally:
                    return "Seasonally";
                case CleaningFrequency.Yearly:
                    return "Yearly";
                case CleaningFrequency.AsNeeded:
                    return "As Needed";
                default:
                    throw new ArgumentOutOfRangeException(nameof(frequency), frequency, null);
            }
        }
    }
}
