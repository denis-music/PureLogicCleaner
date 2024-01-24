export enum UsageFrequency {
    Low,
    Medium,
    High
  }
  
  export function usageFrequencyToFriendlyString(frequency: UsageFrequency): string {
    switch (frequency) {
      case UsageFrequency.Low:
        return 'Low';
      case UsageFrequency.Medium:
        return 'Medium';
      case UsageFrequency.High:
        return 'High';
      default:
        throw new Error(`Unsupported UsageFrequency: ${frequency}`);
    }
  }
  