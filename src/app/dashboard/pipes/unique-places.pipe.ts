import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uniquePlaces',
})
export class UniquePlacesPipe implements PipeTransform {
  transform(
    places: { placeId: number; placeName: string; pictureUrl?: string }[]
  ): {
    pictureUrl?: any;
    placeId: number;
    placeName: string;
  }[] {
    const seen = new Set<number>();
    return places.filter((place) => {
      if (seen.has(place.placeId)) {
        return false;
      }
      seen.add(place.placeId);
      return true;
    });
  }
}
