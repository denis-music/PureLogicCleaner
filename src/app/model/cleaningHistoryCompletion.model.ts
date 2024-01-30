export class CleaningHistoryCompletion {
  Completed: boolean = false;
  CleaningQuality: number;
  CleaningDurationInMins: number;

  constructor(completed : boolean, cleaningQuality: number, cleaningDurationInMins: number) {
    this.Completed =  completed;
    this.CleaningQuality = cleaningQuality;
    this.CleaningDurationInMins = cleaningDurationInMins;
  }
}
