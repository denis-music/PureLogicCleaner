namespace pureLogicCleanerAPI.Models
{
    public class MemberSchedules
    {
        public required string Id { get; set; }
        public required string MemberId { get; set; }
        public required string Room { get; set; } // mozda enum na osnovu unosa membera
        public required bool Completed { get; set; }
        public DateTime CeratedDate { get; set; } = DateTime.Now;
        public DateTime? UpdatedDate { get; set; }
    }
}
