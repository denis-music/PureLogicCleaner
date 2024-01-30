using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using pureLogicCleanerAPI.Models;
using pureLogicCleanerAPI.Repository;
using pureLogicCleanerAPI.VMs;
using pureLogicCleanerAPI.VMs.Requests;

namespace pureLogicCleanerAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CleaningHistoryController(ICosmosDBRepo cosmosDBRepo) : Controller
    {
        private readonly ICosmosDBRepo _cosmosDBRepo = cosmosDBRepo;
        private readonly string containerName = "CleaningHistory";

        [HttpGet(Name = "GetCleaningHistory")]
        public async Task<IList<CleaningHistory>> GetAsync([FromQuery] CleaningHistorySearchRequest searchRequest)
        {
            var iterator = _cosmosDBRepo.GetContainerIterator<CleaningHistory>(containerName) ?? null;
            var result = iterator is not null ?
                (await iterator.ReadNextAsync())
                    .Select(ch => JsonConvert.SerializeObject(ch))
                    .Select(JsonConvert.DeserializeObject<CleaningHistory>)
                    .Where(obj => obj is not null)
                    .ToList() : [];

            var filterResults = result
                .Where(p => (searchRequest.UserRoomId == null || p.UserRoomId == searchRequest.UserRoomId) &&
                (searchRequest.CleaningQuality == null || p.CleaningQuality == searchRequest.CleaningQuality) &&
                (searchRequest.Completed == null || p.Completed == searchRequest.Completed))
                .ToList();

            return filterResults.Any() ? filterResults : result;
        }

        [HttpGet("{id}")]
        public async Task<CleaningHistory>? GetAsyncById(string id)
        {
            return await _cosmosDBRepo.GetItemByIdAsync<CleaningHistory>(containerName, id);
        }

        [HttpPost(Name = "SendCleaningHistory")]
        public async Task<bool> PostAsync(CleaningHistoryVM payload)
        {
            if (payload.CleaningDurationInMins == null || payload.Date == null ||
            payload.UserRoomId == null || payload.CleaningQuality == null ||
                payload.Completed == null) return false;
            string chId = Guid.NewGuid().ToString();
            var newCH = new CleaningHistory
            {
                Id = chId,
                UserRoomId = payload.UserRoomId,
                Completed = (bool)payload.Completed,
                CleaningDurationInMins = (int)payload.CleaningDurationInMins,
                CleaningQuality = (Models.Enums.CleaningQuality)payload.CleaningQuality,
                Date = (DateTime)payload.Date
            };
            return await _cosmosDBRepo.CreateItemAsync(newCH, containerName, newCH.Id);
        }

        [HttpGet("memberRoom/{userId}")]
        public async Task<List<CleaningHistory>>? GetByMemberAsync(string userId)
        {
            var user = await _cosmosDBRepo.GetItemByIdAsync<Users>("Users", userId);
            if (user == null) return null;

            var iteratorUR = _cosmosDBRepo.GetContainerIterator<UserRooms>("UserRooms") ?? null;
            var resultsUR = iteratorUR is not null ?
                (await iteratorUR.ReadNextAsync())
                    .Select(ur => JsonConvert.SerializeObject(ur))
                    .Select(JsonConvert.DeserializeObject<UserRooms>)
                    .Where(obj => obj is not null && obj.UserId == user.Id)
                    .ToList() : [];
            if (resultsUR == null) return null;

            var iteratorCH = _cosmosDBRepo.GetContainerIterator<CleaningHistory>(containerName) ?? null;
            var resultCH = iteratorCH is not null ?
                (await iteratorCH.ReadNextAsync())
                    .Select(ch => JsonConvert.SerializeObject(ch))
                    .Select(JsonConvert.DeserializeObject<CleaningHistory>)
                    .Where(obj => obj is not null)
                    .ToList() : [];

            if (resultCH == null) return null;

            return resultsUR
                 .Join(resultCH,
                    userRoom => userRoom.Id,
                    cleaningHistory => cleaningHistory.UserRoomId,
                    (userRoom, cleaningHistory) => cleaningHistory)
                    .ToList();
        }

        [HttpPut("{id}/completed")]
        public async Task<bool>? PutAsync(string id)
        {
            var ch = await _cosmosDBRepo.GetItemByIdAsync<CleaningHistory>(containerName, id);
            if (ch == null) return false;
            ch.Completed = !ch.Completed;
            ch.UpdatedAt = DateTime.Now;
            return await _cosmosDBRepo.UpdateAsync(ch, containerName, ch.Id);
        }

        [HttpPut("{id}/uncompleted")]
        public async Task<bool>? PutAsyncUncompleted(string id)
        {
            var ch = await _cosmosDBRepo.GetItemByIdAsync<CleaningHistory>(containerName, id);
            if (ch == null) return false;
            ch.Completed = false;
            ch.UpdatedAt = DateTime.Now;

            ch.CleaningDurationInMins = null;
            ch.CleaningQuality = null;
            return await _cosmosDBRepo.UpdateAsync(ch, containerName, ch.Id);
        }

        [HttpPut("{id}/completedInfo")]
        public async Task<bool>? PutAsyncCompletedInfo(string id, CleaningHistoryCompletion request)
        {
            var ch = await _cosmosDBRepo.GetItemByIdAsync<CleaningHistory>(containerName, id);
            if (ch == null) return false;
            ch.Completed = request.Completed;
            ch.CleaningDurationInMins = request.CleaningDurationInMins;
            ch.CleaningQuality = request.CleaningQuality;
            ch.UpdatedAt = DateTime.Now;
            return await _cosmosDBRepo.UpdateAsync(ch, containerName, ch.Id);
        }

    }
}
