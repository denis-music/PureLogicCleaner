using Microsoft.Azure.Cosmos;
using Newtonsoft.Json;

namespace pureLogicCleanerAPI.Repository
{
    public class CosmosDBRepo : ICosmosDBRepo
    {
        private readonly CosmosClient _cosmosClient;
        private readonly Database? _cosmosDatabase;

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
            Container? cosmosDbContainer = _cosmosDatabase?.GetContainer(containerName);

            var iterator = cosmosDbContainer?.GetItemQueryIterator<T>() ?? null;

            return iterator is not null
                ? (await iterator.ReadNextAsync())
                    .Select(user => JsonConvert.SerializeObject(user))
                    .Select(JsonConvert.DeserializeObject<T>)
                    .Where(userObj => userObj is not null)
                    .ToList()
                : [];
        }
    }
}
