// cleaning-frequency.enum.ts

export enum CleaningFrequency {
    Daily = 'Daily',
    EveryThreeDays = 'Every 3 Days',
    TwiceAWeek = 'Twice a Week',
    Weekly = 'Weekly',
    Fortnightly = 'Fortnightly',
    BiWeekly = 'Bi-Weekly',
    TwiceAMonth = 'Twice a Month',
    Monthly = 'Monthly',
    BiMonthly = 'Bi-Monthly',
    Quarterly = 'Quarterly',
    Seasonally = 'Seasonally',
    Yearly = 'Yearly',
    AsNeeded = 'As Needed',
  }
  
  // cleaning-frequency.service.ts
  
  import { Injectable } from '@angular/core';
  
  @Injectable({
    providedIn: 'root',
  })
  export class CleaningFrequencyService {
    toFriendlyString(frequency: CleaningFrequency): string {
      switch (frequency) {
        case CleaningFrequency.Daily:
          return 'Daily';
        case CleaningFrequency.EveryThreeDays:
          return 'Every 3 Days';
        case CleaningFrequency.TwiceAWeek:
          return 'Twice a Week';
        case CleaningFrequency.Weekly:
          return 'Weekly';
        case CleaningFrequency.Fortnightly:
          return 'Fortnightly';
        case CleaningFrequency.BiWeekly:
          return 'Bi-Weekly';
        case CleaningFrequency.TwiceAMonth:
          return 'Twice a Month';
        case CleaningFrequency.Monthly:
          return 'Monthly';
        case CleaningFrequency.BiMonthly:
          return 'Bi-Monthly';
        case CleaningFrequency.Quarterly:
          return 'Quarterly';
        case CleaningFrequency.Seasonally:
          return 'Seasonally';
        case CleaningFrequency.Yearly:
          return 'Yearly';
        case CleaningFrequency.AsNeeded:
          return 'As Needed';
        default:
          throw new Error(`Invalid CleaningFrequency: ${frequency}`);
      }
    }
  }
  