namespace pureLogicCleanerAPI.Repository
{
    public interface ICosmosDBRepo
    {
        Task<IList<T>> GetItemsAsync<T>(string containerName) where T : class;
        Task<bool> CreateItemAsync<T>(T data, string containerName, string partitionKey) where T : class;
        void SetAsync();
    }
}
