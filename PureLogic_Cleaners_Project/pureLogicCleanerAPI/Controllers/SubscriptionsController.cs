using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using pureLogicCleanerAPI.Models;
using pureLogicCleanerAPI.Repository;
using pureLogicCleanerAPI.Services;
using pureLogicCleanerAPI.VMs;
using pureLogicCleanerAPI.VMs.Requests;

namespace pureLogicCleanerAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SubscriptionsController(ICosmosDBRepo cosmosDBRepo, ISubscirptionsService subsService) : Controller
    {
        private readonly ICosmosDBRepo _cosmosDBRepo = cosmosDBRepo;
        private readonly ISubscirptionsService _subsService = subsService;
        private readonly string containerName = "Subscriptions";

        [HttpGet(Name = "GetSubscriptions")]
        public async Task<IList<Subscriptions>> GetAsync([FromQuery] SubscriptionSearchRequest searchRequest)
        {
            var iterator = _cosmosDBRepo.GetContainerIterator<Subscriptions>(containerName) ?? null;
            var results = iterator is not null ?
                (await iterator.ReadNextAsync())
                    .Select(subs => JsonConvert.SerializeObject(subs))
                    .Select(JsonConvert.DeserializeObject<Subscriptions>)
                    .Where(obj => obj is not null)
                    .ToList() : [];

            var filterResults = results
                .Where(p => searchRequest.Name is null || p.Name == searchRequest.Name)
                .ToList();

            return filterResults.Any() ? filterResults : results;

        }

        [HttpGet("{id}")]
        public async Task<Subscriptions>? GetAsyncById(string id)
        {
            return await _cosmosDBRepo.GetItemByIdAsync<Subscriptions>(containerName, id);
        }

        [HttpPost(Name = "SendSubscription")]
        public async Task<bool> PostAsync(SubscriptionsVM payload)
        {
            return await _subsService.PostItem(payload);
        }

        [HttpPut("{id}")]
        public async Task<bool> PutAsync(SubscriptionsVM payload, string id)
        {
            var subs = await _cosmosDBRepo.GetItemByIdAsync<Subscriptions>(containerName, id);
            if (subs == null) return false;
            Subscriptions updatedSubs = new()
            {
                Id = subs.Id,
                DurationInDays = subs.DurationInDays,
                Name = subs.Name,
                Price = (double)(payload.Price == null ? subs.Price : payload.Price),
                SensorsIncluded = (bool)(payload.SensorsIncluded == null ? subs.SensorsIncluded : payload.SensorsIncluded),
                Description = subs.Description
            };
            return await _cosmosDBRepo.UpdateAsync(updatedSubs, containerName, subs.Id);
        }

        [HttpDelete("{id}")]
        public async Task<bool> DeleteAsync(string id)
        {
            return await _cosmosDBRepo.DeleteAsync<Subscriptions>(containerName, id);
        }
    }
}
