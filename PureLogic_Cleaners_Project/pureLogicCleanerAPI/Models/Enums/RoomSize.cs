namespace pureLogicCleanerAPI.Models.Enums
{
    public enum RoomSize
    {
        Small,
        Medium,
        Large
    }

    public static class RoomSizesExtensions
    {
        public static string ToFriendlyString(this RoomSize size)
        {
            switch (size)
            {
                case RoomSize.Small:
                    return "Small";
                case RoomSize.Medium:
                    return "Medium";
                case RoomSize.Large:
                    return "Large";
                default:
                    throw new ArgumentOutOfRangeException(nameof(size), size, null);
            }
        }
    }
}
