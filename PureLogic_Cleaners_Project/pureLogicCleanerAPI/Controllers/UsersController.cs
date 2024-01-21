using Microsoft.AspNetCore.Mvc;
using pureLogicCleanerAPI.Models;
using pureLogicCleanerAPI.Repository;

namespace pureLogicCleanerAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : Controller
    {
        private readonly ICosmosDBRepo _cosmosDBRepo;
        private readonly string databaseName = "Users";

        public UsersController(ICosmosDBRepo cosmosDBRepo)
        {
            _cosmosDBRepo = cosmosDBRepo;
        }

        [HttpGet(Name = "GetUsers")]
        public async Task<IList<Users>> GetAsync()
        {
            return await _cosmosDBRepo.GetItemsAsync<Users>(databaseName);
        }

        [HttpPost(Name = "SendUsers")]
        public async Task<bool> PostAsync(UsersVM payload)
        {
            var newUser = new Users
            {
                Id = payload.Id,
                SubsId = payload.SubsId,
                Ages = payload.Ages,
                FirstName = payload.FirstName,
                LastName = payload.LastName,
                Allergies = payload.Allergies,
                Pets = payload.Pets,
                PreferredCleaningDays = payload.PreferredCleaningDays,
                PreferredCleaningFrequency = payload.PreferredCleaningFrequency,
                PriorityRoomIds = payload.PriorityRoomIds,
            };
            return await _cosmosDBRepo.CreateItemAsync(newUser, databaseName, newUser.SubsId);
        }
    }
}
