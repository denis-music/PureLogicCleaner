using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using pureLogicCleanerAPI.Models;
using pureLogicCleanerAPI.Repository;
using pureLogicCleanerAPI.VMs.Requests;

namespace pureLogicCleanerAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserRoomsController(ICosmosDBRepo cosmosDBRepo) : Controller
    {
        private readonly ICosmosDBRepo _cosmosDBRepo = cosmosDBRepo;
        private readonly string containerName = "UserRooms";

        [HttpGet(Name = "GetUserRooms")]
        public async Task<IList<UserRooms>> GetAsync([FromQuery] UserRoomsSearchRequest searchRequest)
        {
            var iterator = _cosmosDBRepo.GetContainerIterator<UserRooms>(containerName) ?? null;
            var result = iterator is not null ?
                (await iterator.ReadNextAsync())
                    .Select(ur => JsonConvert.SerializeObject(ur))
                    .Select(JsonConvert.DeserializeObject<UserRooms>)
                    .Where(obj => obj is not null)
                    .ToList() : [];

            var filterResults = result
                .Where(p => (searchRequest.UsageFrequency == null || p.UsageFrequency == searchRequest.UsageFrequency) &&
                (searchRequest.SurfaceType == null || p.SurfaceType == searchRequest.SurfaceType) &&
                (searchRequest.RoomId == null || p.RoomId == searchRequest.RoomId) &&
                (searchRequest.RoomSize == null || p.RoomSize == searchRequest.RoomSize) &&
                (searchRequest.UserId  == null || p.UserId == searchRequest.UserId))
                .ToList();

            return filterResults.Any() ? filterResults : result;
        }

        [HttpGet("{id}")]
        public async Task<UserRooms>? GetAsyncById(string id)
        {
            return await _cosmosDBRepo.GetItemByIdAsync<UserRooms>(containerName, id);
        }

        [HttpPost(Name = "SendUserRoom")]
        public async Task<bool> PostAsync(UserRoomsVM payload)
        {
            if (payload.UserId == null || payload.RoomSize == null ||
            payload.RoomId == null || payload.NumberOfOccupants == null ||
            payload.SurfaceType == null || payload.UsageFrequency == null) return false;
            string urId = Guid.NewGuid().ToString();
            var newUR = new UserRooms
            {
                Id = urId,
                RoomId = payload.RoomId,
                NumberOfOccupants = (int)payload.NumberOfOccupants,
                RoomSize = (Models.Enums.RoomSize)payload.RoomSize,
                SurfaceType = (Models.Enums.SurfaceType)payload.SurfaceType,
                UsageFrequency = (Models.Enums.UsageFrequency)payload.UsageFrequency,
                UserId = payload.UserId
            };
            return await _cosmosDBRepo.CreateItemAsync(newUR, containerName, newUR.Id);
        }
    }
}
