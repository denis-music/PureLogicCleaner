namespace pureLogicCleanerAPI.VMs
{
    public class MemberSchedulesVM
    {
        public string? MemberId { get; set; } = null;
        public string? CleaningScheduleId { get; set; } = null;
        public bool? Completed { get; set; } = null;
    }
}
