using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;

namespace pureLogicCleanerAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DBController : Controller
    {
        private readonly CosmosClient _cosmosClient;

        public DBController(CosmosClient cosmosClient)
        {
            _cosmosClient = cosmosClient;
        }

        [HttpGet(Name = "SETDB")]
        public async Task GetAsync()
        {
            Database database = await _cosmosClient.CreateDatabaseIfNotExistsAsync(
                id: "pureLogicCleaner",
                 throughput: 400
            );

            Container container = await database.CreateContainerIfNotExistsAsync(
                id: "user",
                partitionKeyPath: "/id"
            );

            var user1 = new
            {
                id = "1",
                name = "Nudzejma Kezo",
                age = "23",
                email = "nudzejma.kezo@edu.fit.ba",
                phoneNumber = "+38761123123"
            };

            var user2 = new
            {
                id = "2",
                name = "Ajdin Catic",
                age = "23",
                email = "ajdin.catic@edu.fit.ba",
                phoneNumber = "+38761123123"
            };

            await container.UpsertItemAsync(user1); await container.UpsertItemAsync(user2);
        }
    }
}
