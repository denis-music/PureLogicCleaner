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
    public class FeedbacksController(ICosmosDBRepo cosmosDBRepo) : Controller
    {
        private readonly ICosmosDBRepo _cosmosDBRepo = cosmosDBRepo;
        private readonly string databaseName = "Feedbacks";

        [HttpGet(Name = "GetFeedbacks")]
        public async Task<IList<Feedbacks>> GetAsync([FromQuery] FeedbacksSearchRequest searchRequest)
        {
            var iterator = _cosmosDBRepo.GetContainerIterator<Feedbacks>(databaseName) ?? null;
            return iterator is not null ?
                (await iterator.ReadNextAsync())
                    .Select(feedback => JsonConvert.SerializeObject(feedback))
                    .Select(JsonConvert.DeserializeObject<Feedbacks>)
                    .Where(userObj => userObj is not null)
                    .Where(p => p.FeedbackType == searchRequest.FeedbackType ||
                        p.MemberId == searchRequest.MemberId ||
                        p.CleaningScheduleId == searchRequest.CleaningScheduleId ||
                        p.Rating == searchRequest.Rating)
                    .ToList() : [];
        }

        [HttpGet("{id}")]
        public async Task<Feedbacks>? GetAsyncById(string id)
        {
            return await _cosmosDBRepo.GetItemByIdAsync<Feedbacks>(databaseName, id);
        }

        [HttpPost(Name = "SendFeedback")]
        public async Task<bool> PostAsync(FeedbacksVM payload)
        {
            string feedbackId = Guid.NewGuid().ToString();
            var newFeedback = new Feedbacks
            {
                Id = feedbackId,
                MemberId = payload.MemberId,
                CleaningScheduleId = payload.CleaningScheduleId,
                FeedbackType = payload.FeedbackType,
                Rating = payload.Rating,
                Text = payload.Text != null ? payload.Text : ""
            };
            return await _cosmosDBRepo.CreateItemAsync(newFeedback, databaseName, newFeedback.Id);
        }

        [HttpPut("{id}")]
        public async Task<bool> PutAsync(FeedbacksVM payload, string id)
        {
            var feedback = await _cosmosDBRepo.GetItemByIdAsync<Feedbacks>(databaseName, id);
            if (feedback == null) return false;
            Feedbacks updatedFeedback = new()
            {
                Id = feedback.Id,
                MemberId = feedback.MemberId,
                CleaningScheduleId = feedback.CleaningScheduleId,
                FeedbackType = feedback.FeedbackType,
                Rating = payload.Rating,
                Text = payload.Text
            };
            return await _cosmosDBRepo.UpdateFeedbackAsync<Feedbacks>(updatedFeedback, databaseName, feedback.Id);
        }

        [HttpDelete("{id}")]
        public async Task<bool> DeleteAsync(string id)
        {
            return await _cosmosDBRepo.DeleteFeedbackAsync<Feedbacks>(databaseName, id);
        }
    }
}
