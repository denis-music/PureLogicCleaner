using Microsoft.Azure.Cosmos;

namespace pureLogicCleanerAPI.Repository
{
    public interface ICosmosDBRepo
    {
        FeedIterator<T>? GetContainerIterator<T>(string containerName) where T : class;
        Task<IList<T>> GetItemsAsync<T>(string containerName) where T : class;
        Task<T>? GetItemByIdAsync<T>(string containerName, string id) where T : class;
        Task<bool> CreateItemAsync<T>(T data, string containerName, string partitionKey) where T : class;
        Task<bool> UpdateFeedbackAsync<T>(T data, string containerName, string partitionKey) where T : class;
        Task<bool> DeleteFeedbackAsync<T>(string containerName, string partitionKey) where T : class;
        void SetAsync();
    }
}
