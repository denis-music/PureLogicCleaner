using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using pureLogicCleanerAPI.Models;
using pureLogicCleanerAPI.Repository;

namespace pureLogicCleanerAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoomsController(ICosmosDBRepo cosmosDBRepo) : Controller
    {
        private readonly ICosmosDBRepo _cosmosDBRepo = cosmosDBRepo;
        private readonly string containerName = "Rooms";

        [HttpGet(Name = "GetRooms")]
        public async Task<IList<Rooms>> GetAsync([FromQuery] RoomsSearchRequest searchRequest)
        {
            var iterator = _cosmosDBRepo.GetContainerIterator<Rooms>(containerName) ?? null;
            var result = iterator is not null ?
                (await iterator.ReadNextAsync())
                    .Select(r => JsonConvert.SerializeObject(r))
                    .Select(JsonConvert.DeserializeObject<Rooms>)
                    .Where(obj => obj is not null)
                    .ToList() : [];

            var filterResults = result
                .Where(p => (searchRequest.Name == null || p.Name == searchRequest.Name))
                .ToList();

            return filterResults.Any() ? filterResults : result;
        }

        [HttpGet("{id}")]
        public async Task<Rooms>? GetAsyncById(string id)
        {
            return await _cosmosDBRepo.GetItemByIdAsync<Rooms>(containerName, id);
        }

        [HttpPost(Name = "SendRoom")]
        public async Task<bool> PostAsync(RoomsSearchRequest payload)
        {
            if (payload.Name == null) return false;
            string r = Guid.NewGuid().ToString();
            var newUR = new Rooms
            {
                Id = r,
                Name = payload.Name
            };
            return await _cosmosDBRepo.CreateItemAsync(newUR, containerName, newUR.Id);
        }
    }
}
