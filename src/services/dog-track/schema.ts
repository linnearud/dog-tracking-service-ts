import { z } from "zod";
import { RequestContext } from "../../api/request";

export const createDogTrack = z.object({
  originalTrackId: z.coerce.number(),
  startLatitude: z.number(),
  startLongitude: z.number(),
  dogId: z.number(),
});

export const addDogTrackCoordinates = z.object({
  dogTrackId: z.coerce.number(),
  coordinates: z.array(
    z.object({
      latitude: z.number(),
      longitude: z.number(),
      timestamp: z.coerce.date(),
    }),
  ),
});

export const completeDogTrack = z.object({
  dogTrackId: z.coerce.number(),
});

export const deleteDogTrack = z.object({
  dogTrackId: z.coerce.number(),
});

export const getDogTrackCoordinates = z.object({
  dogTrackId: z.coerce.number(),
});
