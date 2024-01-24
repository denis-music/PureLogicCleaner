// cleaning-frequency.enum.ts

export enum CleaningFrequency {
  Daily = 0,
  EveryThreeDays = 1,
  TwiceAWeek = 2,
  Weekly = 3,
  Fortnightly = 4,
  BiWeekly = 5,
  TwiceAMonth = 6,
  Monthly = 7,
  BiMonthly = 8,
  Quarterly = 9,
  Seasonally = 10,
  Yearly = 11,
  AsNeeded = 12,
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
