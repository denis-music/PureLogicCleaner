import { FeedbackType } from "../enum/feedbackType.enum";

export class Feedback {
    id?: string;
    memberId?: string;
    cleaningHistoryId: string;
    feedbackType: number;
    rating: number;
    dateSubmitted: Date = new Date();
    text?: string;
  
    constructor(
      cleaningHistoryId: string,
      feedbackType: number,
      rating: number,
      text?: string,
      id?: string,
      memberId?: string,
      dateSubmitted?: Date
    ) {
      this.id == null ? null : id;
      this.memberId == null ? null : memberId;
      this.cleaningHistoryId = cleaningHistoryId;
      this.feedbackType = feedbackType;
      this.rating = rating;
      this.dateSubmitted == null  ? null : dateSubmitted;
      this.text = text;
    }
}