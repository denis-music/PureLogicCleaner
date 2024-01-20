using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using pureLogicCleanerAPI.Models;
using pureLogicCleanerAPI.Repository;
using pureLogicCleanerAPI.VMs.Requests;
using pureLogicCleanerAPI.VMs;

namespace pureLogicCleanerAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MemberSchedulesController(ICosmosDBRepo cosmosDBRepo) : Controller
    {
        private readonly ICosmosDBRepo _cosmosDBRepo = cosmosDBRepo;
        private readonly string containerName = "MemberSchedules";

        [HttpGet(Name = "GetMemberSchedules")]
        public async Task<IList<MemberSchedules>> GetAsync([FromQuery] MemberSchedulesSearchRequest searchRequest)
        {
            var iterator = _cosmosDBRepo.GetContainerIterator<MemberSchedules>(containerName) ?? null;
            var result = iterator is not null ?
                (await iterator.ReadNextAsync())
                    .Select(ms => JsonConvert.SerializeObject(ms))
                    .Select(JsonConvert.DeserializeObject<MemberSchedules>)
                    .Where(obj => obj is not null)
                    .ToList() : [];

            var filterResults = result
                .Where(p => (searchRequest.Room == null || p.Room == searchRequest.Room) &&
                (searchRequest.MemberId == null || p.MemberId == searchRequest.MemberId))
                .ToList();

            return filterResults.Any() ? filterResults : result;
        }

        [HttpGet("{id}")]
        public async Task<MemberSchedules>? GetAsyncById(string id)
        {
            return await _cosmosDBRepo.GetItemByIdAsync<MemberSchedules>(containerName, id);
        }

        [HttpPost(Name = "SendMemberSchedule")]
        public async Task<bool> PostAsync(MemberSchedulesVM payload)
        {
            if (payload.MemberId == null || payload.Room == null ||
                payload.Completed == null) return false;
            string msId = Guid.NewGuid().ToString();
            var newMS = new MemberSchedules
            {
                Id = msId,
                MemberId = payload.MemberId,
                Room = payload.Room,
                Completed = (bool)payload.Completed
            };
            return await _cosmosDBRepo.CreateItemAsync(newMS, containerName, newMS.Id);
        }

        [HttpPut("{id}")]
        public async Task<bool> PutAsync(MemberSchedulesVM payload, string id)
        {
            var ms = await _cosmosDBRepo.GetItemByIdAsync<MemberSchedules>(containerName, id);
            if (ms == null) return false;
            MemberSchedules updateMs = new()
            {
                Id = ms.Id,
                Room = ms.Room,
                MemberId = ms.MemberId,
                Completed = (bool)(payload.Completed == null ? false : payload.Completed),
                UpdatedDate = DateTime.Now
            };
            return await _cosmosDBRepo.UpdateAsync(updateMs, containerName, ms.Id);
        }
    }
}
