import { z } from "zod";
import { RequestContext } from "../../api/request";

export const createDogTrack = z.object({
  originalTrackId: z.number(),
  startLatitude: z.number(),
  startLongitude: z.number(),
  dogId: z.number(),
});

export const addDogTrackCoordinates = z.object({
  dogTrackId: z.number(),
  coordinates: z.array(
    z.object({
      latitude: z.number(),
      longitude: z.number(),
      timestamp: z.date(),
    }),
  ),
});

export const completeDogTrack = z.object({
  dogTrackId: z.number(),
});

export const deleteDogTrack = z.object({
  dogTrackId: z.number(),
});

export const getDogTrackCoordinates = z.object({
  dogTrackId: z.number(),
});
