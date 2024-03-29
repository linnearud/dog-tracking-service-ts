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

  async listOriginalTracks({
    context,
  }: {
    context: RequestContext;
  }): Promise<OriginalTrack[]> {
    return this.database.listOriginalTracksByUser({ userId: context.userId });
  }

  async createOriginalTrack({
    data,
    context,
  }: {
    data: z.infer<typeof schema.createOriginalTrack>;
    context: RequestContext;
  }): Promise<OriginalTrack> {
    return this.database.createOriginalTrack({
      startLat: data.startLatitude,
      startLong: data.startLongitude,
      startType: data.startType,
      accessRole: "OWNER",
      userId: context.userId,
    });
  }

  async addOriginalTrackCoordinates({
    data,
    context,
  }: {
    data: z.infer<typeof schema.addOriginalTrackCoordinates>;
    context: RequestContext;
  }): Promise<Coordinate[]> {
    const originalTrack = await this.database.getOriginalTrackById({
      id: data.originalTrackId,
    });

    if (!originalTrack) {
      throw new NotFoundError("Original track not found");
    }

    if (originalTrack.endedAt) {
      throw new BadRequestError("Cannot add coordinates for ended track");
    }

    return this.database.createOriginalTrackCoordinates({
      originalTrackId: data.originalTrackId,
      coordinates: data.coordinates.map((c) => ({
        lat: c.latitude,
        long: c.longitude,
        type: c.type,
        createdAt: c.timestamp,
      })),
    });
  }

  async completeOriginalTrack({
    data,
    context,
  }: {
    data: z.infer<typeof schema.completeOriginalTrack>;
    context: RequestContext;
  }): Promise<OriginalTrack> {
    const distance = 100; // calculate distance

    return this.database.updateOriginalTrack({
      originalTrackId: data.originalTrackId,
      endedAt: new Date(),
      distance,
    });
  }

  async deleteOriginalTrack({
    data,
    context,
  }: {
    data: z.infer<typeof schema.completeOriginalTrack>;
    context: RequestContext;
  }): Promise<number> {
    return this.database.deleteOriginalTrack({
      originalTrackId: data.originalTrackId,
    });
  }

  async getOriginalTrackCoordinates({
    data,
    context,
  }: {
    data: z.infer<typeof schema.getOriginalTrackCoordinates>;
    context: RequestContext;
  }): Promise<Coordinate[]> {
    const coordinates = await this.database.getOriginalTrackCoordinates({
      originalTrackId: data.originalTrackId,
    });

    if (!coordinates) {
      throw new NotFoundError("Original track not found");
    }

    return coordinates;
  }

  async listDogTracks({
    data,
    context,
  }: {
    data: z.infer<typeof schema.listDogTracks>;
    context: RequestContext;
  }): Promise<DogTrack[]> {
    return this.database.listDogTracksByOriginalTrackIdAndUserId({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
  }
}
