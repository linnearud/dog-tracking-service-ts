import { Prisma } from "@prisma/client";

import { TrackInfo, DogTrack } from "./entities";

export const mapDbTrackToTrackInfo = (
  dbTrack: Prisma.TrackGetPayload<{}>,
): TrackInfo => {
  return {
    createdAt: dbTrack.createdAt,
    endedAt: dbTrack.endedAt || undefined,
    distance: dbTrack.distance || undefined,
    description: dbTrack.description || undefined,
    weather: dbTrack.weather || undefined,
  };
};

export const mapDbDogTrackToDogTrack = (
  dbDogTrack: Prisma.DogTrackGetPayload<{
    include: {
      track: true;
      originalTrack: { include: { track: true } };
      dog: true;
    };
  }>,
): DogTrack => ({
  ...mapDbTrackToTrackInfo(dbDogTrack.track),
  id: dbDogTrack.id,
  originalTrack: {
    id: dbDogTrack.originalTrack.id,
    ...mapDbTrackToTrackInfo(dbDogTrack.originalTrack.track),
  },
  dog: {
    ...dbDogTrack.dog,
  },
});
