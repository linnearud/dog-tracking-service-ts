import { z } from "zod";
import { RequestContext } from "../../api/request";

export const listOriginalTracks = z.object({});

export const createOriginalTrack = z.object({
  startLatitude: z.number(),
  startLongitude: z.number(),
  startType: z.enum(["HOOF", "BLOOD_AND_HOOF"]),
});

export const addOriginalTrackCoordinates = z.object({
  originalTrackId: z.coerce.number(),
  coordinates: z.array(
    z.object({
      latitude: z.number(),
      longitude: z.number(),
      type: z.enum(["HOOF", "BLOOD_AND_HOOF"]),
      timestamp: z.coerce.date(),
    }),
  ),
});

export const completeOriginalTrack = z.object({
  originalTrackId: z.coerce.number(),
});

export const deleteOriginalTrack = z.object({
  originalTrackId: z.coerce.number(),
});

export const getOriginalTrackCoordinates = z.object({
  originalTrackId: z.coerce.number(),
});

export const listDogTracks = z.object({
  originalTrackId: z.coerce.number(),
});
