using Microsoft.AspNetCore.Authorization;
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
        private readonly string containerName = "Feedbacks";

        [HttpGet(Name = "GetFeedbacks")]
        public async Task<IList<Feedbacks>> GetAsync([FromQuery] FeedbacksSearchRequest searchRequest)
        {
            var iterator = _cosmosDBRepo.GetContainerIterator<Feedbacks>(containerName) ?? null;
            var result = iterator is not null ?
                (await iterator.ReadNextAsync())
                    .Select(feedback => JsonConvert.SerializeObject(feedback))
                    .Select(JsonConvert.DeserializeObject<Feedbacks>)
                    .Where(obj => obj is not null)
                    .ToList() : [];

            var filterResults = result
                .Where(p =>
                (searchRequest.CleaningScheduleId == null || p.CleaningScheduleId == searchRequest.CleaningScheduleId) &&
                (searchRequest.MemberId == null || p.MemberId == searchRequest.MemberId) &&
                (searchRequest.FeedbackType == null || p.FeedbackType == searchRequest.FeedbackType) &&
                (searchRequest.Rating == null || p.Rating == searchRequest.Rating))
                .ToList();

            return filterResults.Any() ? filterResults : result;
        }

        [HttpGet("{id}")]
        public async Task<Feedbacks>? GetAsyncById(string id)
        {
            return await _cosmosDBRepo.GetItemByIdAsync<Feedbacks>(containerName, id);
        }

        [HttpPost(Name = "SendFeedback")]
        public async Task<bool> PostAsync(FeedbacksVM payload)
        {
            if (payload.CleaningScheduleId == null || payload.FeedbackType == null ||
                payload.MemberId == null || payload.Rating == null) return false;
            string feedbackId = Guid.NewGuid().ToString();
            var newFeedback = new Feedbacks
            {
                Id = feedbackId,
                MemberId = payload.MemberId,
                CleaningScheduleId = payload.CleaningScheduleId,
                FeedbackType = (Models.Enums.FeedbackType)payload.FeedbackType,
                Rating = (int)payload.Rating,
                Text = payload.Text != null ? payload.Text : ""
            };
            return await _cosmosDBRepo.CreateItemAsync(newFeedback, containerName, newFeedback.Id);
        }

        [HttpPut("{id}")]
        public async Task<bool> PutAsync(FeedbacksVM payload, string id)
        {
            var feedback = await _cosmosDBRepo.GetItemByIdAsync<Feedbacks>(containerName, id);
            if (feedback == null) return false;
            Feedbacks updatedFeedback = new()
            {
                Id = feedback.Id,
                MemberId = feedback.MemberId,
                CleaningScheduleId = feedback.CleaningScheduleId,
                FeedbackType = feedback.FeedbackType,
                Rating = (int)(payload.Rating == null ? feedback.Rating : payload.Rating),
                Text = payload.Text == null ? feedback.Text : payload.Text
            };
            return await _cosmosDBRepo.UpdateAsync<Feedbacks>(updatedFeedback, containerName, feedback.Id);
        }

        [HttpDelete("{id}")]
        public async Task<bool> DeleteAsync(string id)
        {
            return await _cosmosDBRepo.DeleteAsync<Feedbacks>(containerName, id);
        }
    }
}
