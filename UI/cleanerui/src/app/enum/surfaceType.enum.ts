export enum SurfaceType {
    Carpet,
    Hardwood,
    Tile
  }
  
  export function surfaceTypeToFriendlyString(type: SurfaceType): string {
    switch (type) {
      case SurfaceType.Carpet:
        return 'Carpet';
      case SurfaceType.Hardwood:
        return 'Hardwood';
      case SurfaceType.Tile:
        return 'Tile';
      default:
        throw new Error(`Unsupported SurfaceType: ${type}`);
    }
  }
  