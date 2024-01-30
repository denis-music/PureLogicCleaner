export enum RoomSize {
  Small,
  Medium,
  Large
}

export function roomSizeToFriendlyString(size: RoomSize): string {
  switch (size) {
    case RoomSize.Small:
      return 'Small';
    case RoomSize.Medium:
      return 'Medium';
    case RoomSize.Large:
      return 'Large';
    default:
      throw new Error(`Unsupported RoomSize: ${size}`);
  }
}
