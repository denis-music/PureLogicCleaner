using Newtonsoft.Json;
using pureLogicCleanerAPI.Models;
using pureLogicCleanerAPI.Models.Enums;
using pureLogicCleanerAPI.Repository;
using pureLogicCleanerAPI.VMs;

namespace pureLogicCleanerAPI.Services
{
    public class SubscirptionsService(ICosmosDBRepo cosmosDBRepo): ISubscirptionsService
    {
        private readonly ICosmosDBRepo _cosmosDBRepo = cosmosDBRepo;
        private readonly string containerName = "Subscriptions";

        public async Task<bool> PostItem(SubscriptionsVM payload)
        {
            return await PostFunction(payload);
        }

        public async Task<bool> SyncSubsInDB()
        {
            var iterator = _cosmosDBRepo.GetContainerIterator<Subscriptions>(containerName) ?? null;
            var results = iterator is not null ?
                (await iterator.ReadNextAsync())
                    .Select(subs => JsonConvert.SerializeObject(subs))
                    .Select(JsonConvert.DeserializeObject<Subscriptions>)
                    .Where(obj => obj is not null)
                    .ToList() : [];

            if (results.Count != 0) { return false; }
            else
            {
                try
                {
                    var basicModel = new SubscriptionsVM(
                        SubscirptionNamesExtensions.ToFriendlyString(SubscirptionNames.FreeTrial),
                        0,
                        false,
                        30
                        );

                    await PostFunction(basicModel);

                    var monthlyModel = new SubscriptionsVM(
                        SubscirptionNamesExtensions.ToFriendlyString(SubscirptionNames.Monthly),
                        19.99,
                        false,
                        30
                        );

                    await PostFunction(monthlyModel);

                    var annualModel = new SubscriptionsVM(
                        SubscirptionNamesExtensions.ToFriendlyString(SubscirptionNames.Annual),
                        99.99,
                        false,
                        365
                        );

                    await PostFunction(annualModel);

                    var premiumModel = new SubscriptionsVM(
                        SubscirptionNamesExtensions.ToFriendlyString(SubscirptionNames.Premium),
                        129.99,
                        true,
                        365
                        );

                    await PostFunction(premiumModel);
                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }
        }

        private async Task<bool> PostFunction(SubscriptionsVM payload)
        {
            if (payload.DurationInDays is null || payload.SensorsIncluded is null ||
               payload.Price is null || payload.Name is null)
                return false;

            string subsId = Guid.NewGuid().ToString();
            var newSubs = new Subscriptions
            {
                Id = subsId,
                DurationInDays = (int)payload.DurationInDays,
                Name = payload.Name,
                Price = (double)payload.Price,
                SensorsIncluded = (bool)payload.SensorsIncluded,
                Description = payload.Description
            };
            return await _cosmosDBRepo.CreateItemAsync(newSubs, containerName, newSubs.Id);
        }
    }
}
