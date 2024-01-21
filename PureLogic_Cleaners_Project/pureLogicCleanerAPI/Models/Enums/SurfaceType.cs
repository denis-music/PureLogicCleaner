namespace pureLogicCleanerAPI.Models.Enums
{
    public enum SurfaceType
    {
        Carpet,
        Hardwood,
        Tile
    }

    public static class SurfaceTypeExtensions
    {
        public static string ToFriendlyString(this SurfaceType size)
        {
            switch (size)
            {
                case SurfaceType.Carpet:
                    return "Carpet";
                case SurfaceType.Hardwood:
                    return "Hardwood";
                case SurfaceType.Tile:
                    return "Tile";
                default:
                    throw new ArgumentOutOfRangeException(nameof(size), size, null);
            }
        }
    }
}
