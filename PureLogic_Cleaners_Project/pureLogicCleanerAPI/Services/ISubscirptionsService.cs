using pureLogicCleanerAPI.VMs;

namespace pureLogicCleanerAPI.Services
{
    public interface ISubscirptionsService
    {
        Task<bool> PostItem(SubscriptionsVM payload);
        Task<bool> SyncSubsInDB();
    }
}
