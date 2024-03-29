export type Dog = {
  id: number;
  createdAt: Date;
  name: string;
};

export type Coordinate = {
  id: number;
  lat: Decimal;
  long: Decimal;
  createdAt: Date;
  type: "HOOF" | "BLOOD_AND_HOOF" | "DOG";
};

export type TrackInfo = {
  createdAt: Date;
  endedAt?: Date;
  distance?: Decimal;
  description?: string;
  weather?: string;
};

export type DogTrack = TrackInfo & {
  id: number;
  originalTrack: OriginalTrack;
  dog: Dog;
};

export type DogTrackCoordinates = {
  dog: Coordinate[]
  original: Coordinate[]
}

export type OriginalTrack = TrackInfo & { id: number };
