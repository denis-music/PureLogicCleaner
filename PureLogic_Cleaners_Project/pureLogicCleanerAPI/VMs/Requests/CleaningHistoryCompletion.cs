using pureLogicCleanerAPI.Models.Enums;

namespace pureLogicCleanerAPI.VMs.Requests
{
    public class CleaningHistoryCompletion
    {
        public required bool Completed { get; set; } = false;
        public required CleaningQuality CleaningQuality { get; set; }
        public required int CleaningDurationInMins { get; set; }
    }
}
