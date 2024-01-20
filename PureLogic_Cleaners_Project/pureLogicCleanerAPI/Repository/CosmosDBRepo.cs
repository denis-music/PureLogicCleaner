using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;

namespace pureLogicCleanerAPI.Repository
{
    public class CosmosDBRepo : ICosmosDBRepo
    {
        public readonly CosmosClient _cosmosClient;
        public readonly Database? _cosmosDatabase;

        public CosmosDBRepo(IConfiguration config)
        {
            var endpoint = config["CosmosDB:Endpoint"];
            var dbName = config["CosmosDB:DB"];
            var key = config["CosmosDB:Key"];

            CosmosClientOptions cosmosClientOptions = new()
            {
                SerializerOptions = new CosmosSerializationOptions()
                {
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                }
            };
            _cosmosClient = new CosmosClient(endpoint, key, cosmosClientOptions);
            _cosmosDatabase = _cosmosClient.GetDatabase(dbName);
        }

        public async void SetAsync()
        {
            Database database = await _cosmosClient.CreateDatabaseIfNotExistsAsync(
                id: "pureLogicCleaner",
                 throughput: 400
            );

            await database.CreateContainerIfNotExistsAsync(
                id: "Users",
                partitionKeyPath: "/id"
            );
            await database.CreateContainerIfNotExistsAsync(
                id: "CleaningSchedules",
                partitionKeyPath: "/id"
            );
            await database.CreateContainerIfNotExistsAsync(
                id: "Feedbacks",
                partitionKeyPath: "/id"
            );
            await database.CreateContainerIfNotExistsAsync(
                id: "Subscriptions",
                partitionKeyPath: "/id"
            );
            await database.CreateContainerIfNotExistsAsync(
                id: "Statistics",
                partitionKeyPath: "/id"
            );
            await database.CreateContainerIfNotExistsAsync(
                id: "MemberSchedules",
                partitionKeyPath: "/id"
            );
        }

        public FeedIterator<T>? GetContainerIterator<T>(string containerName) where T : class
        {
            Container? cosmosDbContainer = _cosmosDatabase?.GetContainer(containerName);

            return cosmosDbContainer?.GetItemQueryIterator<T>() ?? null;
        }

        public async Task<T>? GetItemByIdAsync<T>(string containerName, string id) where T : class
        {
            Container? container = _cosmosDatabase?.GetContainer(containerName);
            try
            {
                var response = await container.ReadItemAsync<T>(id, new PartitionKey(id));
                return response.Resource;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<bool> CreateItemAsync<T>(T data, string containerName, string partitionKey) where T : class
        {
            Container? cosmosDbContainer = _cosmosDatabase?.GetContainer(containerName);

            if (cosmosDbContainer != null)
            {
                var res = await cosmosDbContainer.CreateItemAsync(data, new PartitionKey(partitionKey));
                return res.StatusCode == System.Net.HttpStatusCode.Created;
            }

            return false;
        }

        public async Task<IList<T>> GetItemsAsync<T>(string containerName) where T : class
        {
            var iterator = GetContainerIterator<T>(containerName);

            return iterator is not null
                ? (await iterator.ReadNextAsync())
                    .Select(user => JsonConvert.SerializeObject(user))
                    .Select(JsonConvert.DeserializeObject<T>)
                    .Where(userObj => userObj is not null)
                    .ToList()
                : [];
        }

        public async Task<bool> UpdateAsync<T>(T updatedItem, string containerName, string id) where T : class
        {
            try
            {
                Container? container = _cosmosDatabase?.GetContainer(containerName);
                ItemResponse<T> response = await container.ReplaceItemAsync(
                    updatedItem,
                    id,
                    new PartitionKey(id));
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<bool> DeleteAsync<T>(string containerName, string id) where T : class
        {
            try
            {
                Container? container = _cosmosDatabase?.GetContainer(containerName);
                ItemResponse<T> response = await container.DeleteItemAsync<T>(
                id,
                new PartitionKey(id));
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
