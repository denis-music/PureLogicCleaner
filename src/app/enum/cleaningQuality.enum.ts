export enum CleaningQuality {
    Quick = 0,
    Basic = 1,
    Thorough = 2
}

export function getCleaningQualityName(value: number): string {
    return CleaningQuality[value];
}