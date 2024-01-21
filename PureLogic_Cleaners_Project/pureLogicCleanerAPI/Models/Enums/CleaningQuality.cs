namespace pureLogicCleanerAPI.Models.Enums
{
    public enum CleaningQuality
    {
        Quick,
        Basic,
        Thorough
    }

    public static class CleaningQualityExtensions
    {
        public static string ToFriendlyString(this CleaningQuality size)
        {
            switch (size)
            {
                case CleaningQuality.Quick:
                    return "Quick";
                case CleaningQuality.Basic:
                    return "Basic";
                case CleaningQuality.Thorough:
                    return "Thorough";
                default:
                    throw new ArgumentOutOfRangeException(nameof(size), size, null);
            }
        }
    }
}
