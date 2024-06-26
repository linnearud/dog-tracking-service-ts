import { RequestContext } from "../../api/request";
import { Database } from "../../data/database";
import { OriginalTrack, Coordinate, DogTrack } from "../../data/entities";
import { NotFoundError, BadRequestError } from "../../utils/errors";
import { z } from "zod";

import * as schema from "./schema";

export class OriginalTrackService {
  private database: Database;

  constructor({ database }: { database: Database }) {
    this.database = database;
  }

  listOriginalTracks = ({
    context,
  }: {
    context: RequestContext;
  }): Promise<OriginalTrack[]> => {
    return this.database.originalTrack.listOriginalTracksByUser({
      userId: context.userId,
    });
  };

  createOriginalTrack = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.createOriginalTrack>;
    context: RequestContext;
  }): Promise<OriginalTrack> => {
    return this.database.originalTrack.createOriginalTrack({
      startLat: data.startLatitude,
      startLong: data.startLongitude,
      startType: data.startType,
      accessRole: "OWNER",
      userId: context.userId,
    });
  };

  addOriginalTrackCoordinates = async ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.addOriginalTrackCoordinates>;
    context: RequestContext;
  }): Promise<Coordinate[]> => {
    const originalTrack =
      await this.database.originalTrack.getOriginalTrackById({
        id: data.originalTrackId,
      });

    if (!originalTrack) {
      throw new NotFoundError("Original track not found");
    }

    if (originalTrack.endedAt) {
      throw new BadRequestError("Cannot add coordinates for ended track");
    }

    return this.database.originalTrack.createOriginalTrackCoordinates({
      originalTrackId: data.originalTrackId,
      coordinates: data.coordinates.map((c) => ({
        lat: c.latitude,
        long: c.longitude,
        type: c.type,
        createdAt: c.timestamp,
      })),
    });
  };

  completeOriginalTrack = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.completeOriginalTrack>;
    context: RequestContext;
  }): Promise<OriginalTrack> => {
    const distance = 100; // calculate distance

    return this.database.originalTrack.updateOriginalTrack({
      originalTrackId: data.originalTrackId,
      endedAt: new Date(),
      distance,
    });
  };

  deleteOriginalTrack = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.completeOriginalTrack>;
    context: RequestContext;
  }): Promise<number> => {
    return this.database.originalTrack.deleteOriginalTrack({
      originalTrackId: data.originalTrackId,
    });
  };

  getOriginalTrackCoordinates = async ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.getOriginalTrackCoordinates>;
    context: RequestContext;
  }): Promise<Coordinate[]> => {
    const coordinates =
      await this.database.originalTrack.getOriginalTrackCoordinates({
        originalTrackId: data.originalTrackId,
      });

    if (!coordinates) {
      throw new NotFoundError("Original track not found");
    }

    return coordinates;
  };

  listDogTracks = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.listDogTracks>;
    context: RequestContext;
  }): Promise<DogTrack[]> => {
    return this.database.originalTrack.listDogTracksByOriginalTrackIdAndUserId({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
  };
}
