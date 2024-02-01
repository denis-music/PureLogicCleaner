using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using pureLogicCleanerAPI.DTOs;
using pureLogicCleanerAPI.Models;
using pureLogicCleanerAPI.Models.Enums;
using pureLogicCleanerAPI.Repository;
using pureLogicCleanerAPI.Services;
using pureLogicCleanerAPI.VMs.Requests;

namespace pureLogicCleanerAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : Controller
    {
        private readonly ICosmosDBRepo _cosmosDBRepo;
        private readonly string containerName = "Users";
        private readonly IUserService _userService;

        public UsersController(ICosmosDBRepo cosmosDBRepo, IUserService userService)
        {
            _cosmosDBRepo = cosmosDBRepo;
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }

        [HttpGet(Name = "GetUsers")]
        public async Task<IList<Users>> GetAsync()
        {
            return await _cosmosDBRepo.GetItemsAsync<Users>(containerName);
        }

        [HttpGet("/username/{username}")]
        public async Task<IList<Users>> GetAsync(string username)
        {
            var iterator = _cosmosDBRepo.GetContainerIterator<Users>(containerName) ?? null;
            var result = iterator is not null ?
                (await iterator.ReadNextAsync())
                    .Select(u => JsonConvert.SerializeObject(u))
                    .Select(JsonConvert.DeserializeObject<Users>)
                    .Where(obj => obj is not null)
                    .ToList() : [];

            var filterResults = result
                .Where(p => (username == null || p.Username == username))
                .ToList();

            return filterResults.Any() ? filterResults : result;
        }

        [HttpGet("{id}")]
        public async Task<Users>? GetAsyncById(string id)
        {
            return await _cosmosDBRepo.GetItemByIdAsync<Users>(containerName, id);
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserUpsert userDto)
        {
            var iterator = _cosmosDBRepo.GetContainerIterator<Users>(containerName) ?? null;
            var user = iterator is not null ?
                (await iterator.ReadNextAsync())
                    .Select(feedback => JsonConvert.SerializeObject(feedback))
                    .Select(JsonConvert.DeserializeObject<Users>)
                    .FirstOrDefault(obj => obj is not null &&
                    obj.Username == userDto.Username)
            : null;

            if (user != null)
            {
                return BadRequest("Username already taken.");
            }

            var subs = await _cosmosDBRepo.GetItemsAsync<Subscriptions>("Subscriptions");
            var freeTrialSub = subs.Where(s => s.Name == SubscirptionNamesExtensions.ToFriendlyString(SubscirptionNames.FreeTrial)).FirstOrDefault();
            if (freeTrialSub == null) return BadRequest();
            var newUser = await _userService.RegisterUser(userDto);
            string id = Guid.NewGuid().ToString();
            newUser.Id = id;
            newUser.SubsId = freeTrialSub.Id;
            newUser.SubscriptionDateBought = DateTime.Now;
            newUser.SubscriptionDaysLeft = freeTrialSub.DurationInDays;
            newUser.SubscriptionDays = freeTrialSub.DurationInDays;

            await _cosmosDBRepo.CreateItemAsync(newUser, containerName, id);

            return Ok();
        }

        [HttpPut("{id}/habits")]
        public async Task<bool?> UpdateUser(string id, [FromBody] UserHabitsUpsertRequest userDto)
        {
            var user = await _cosmosDBRepo.GetItemByIdAsync<Users>(containerName, id);
            if (user == null) return null;
            user.Allergies = userDto.Allergies;
            user.Pets = userDto.Pets;
            user.PreferredCleaningFrequency = userDto.PreferredCleaningFrequency;
            user.PreferredCleaningDays = userDto.PreferredCleaningDays;
            user.PriorityRoomIds = userDto.PriorityRoomIds;
            return await _cosmosDBRepo.UpdateAsync(user, containerName, user.Id);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Authenticate([FromBody] UserForAuthenticationDto userForAuthenticationDto)
        {
            var iterator = _cosmosDBRepo.GetContainerIterator<Users>(containerName) ?? null;
            var result = iterator is not null ?
                (await iterator.ReadNextAsync())
                    .Select(feedback => JsonConvert.SerializeObject(feedback))
                    .Select(JsonConvert.DeserializeObject<Users>)
                    .FirstOrDefault(obj => obj is not null &&
                    obj.Username == userForAuthenticationDto.Username)
            : null;

            var user = _userService.ValidateUser(userForAuthenticationDto, result);
            if (user is null)
                return Unauthorized();

            var subs = await _cosmosDBRepo.GetItemByIdAsync<Subscriptions>("Subscriptions", user.SubsId);
            if (subs == null) return BadRequest();
            DateTime subscriptionDateBought = (DateTime)user.SubscriptionDateBought;
            TimeSpan difference = DateTime.Now - subscriptionDateBought;
            user.SubscriptionDaysLeft = difference.Days;
            user.SubscriptionDays = subs.DurationInDays;
            await _cosmosDBRepo.UpdateAsync(user, containerName, user.Id);

            return Ok(new
            {
                token = await _userService.CreateToken(user)
            }
            );
        }

        [HttpPut("/member/{userId}/subscription/{subsId}")]
        public async Task<bool> AddMembersSubs(string userId, string subsId)
        {
            var subs = await _cosmosDBRepo.GetItemByIdAsync<Subscriptions>("Subscriptions", subsId);
            if (subs == null) return false;
            var user = await _cosmosDBRepo.GetItemByIdAsync<Users>(containerName, userId);
            user.SubsId = subsId;
            user.SubscriptionDateBought = DateTime.Now;
            user.SubscriptionDaysLeft = subs.DurationInDays;
            user.SubscriptionDays = subs.DurationInDays;
            return await _cosmosDBRepo.UpdateAsync(user, containerName, user.Id);
        }
    }
}
