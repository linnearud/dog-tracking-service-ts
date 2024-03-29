import { RequestContext } from "../../api/request";
import { Database } from "../../data/database";
import { OriginalTrack, Coordinate, DogTrack } from "../../data/entities";
import { NotFoundError, BadRequestError } from "../../utils/errors";
import { z } from "zod";

import * as schema from "./schema";

export class DogTrackService {
  private database: Database;

  constructor({ database }: { database: Database }) {
    this.database = database;
  }

  async createDogTrack({
    data,
    context,
  }: {
    data: z.infer<typeof schema.createDogTrack>;
    context: RequestContext;
  }): Promise<DogTrack> {
    return this.database.createDogTrack({
      startLat: data.startLatitude,
      startLong: data.startLongitude,
      userId: context.userId,
      originalTrackId: data.originalTrackId,
      dogId: data.dogId
    });
  }

  async addDogTrackCoordinates({
    data,
    context,
  }: {
    data: z.infer<typeof schema.addDogTrackCoordinates>;
    context: RequestContext;
  }): Promise<Coordinate[]> {
    const dogTrack = await this.database.getDogTrackById({
      id: data.dogTrackId,
    });

    if (!dogTrack) {
      throw new NotFoundError("Original track not found");
    }

    if (dogTrack.endedAt) {
      throw new BadRequestError("Cannot add coordinates for ended track");
    }

    return this.database.createDogTrackCoordinates({
      dogTrackId: data.dogTrackId,
      coordinates: data.coordinates.map((c) => ({
        lat: c.latitude,
        long: c.longitude,
        createdAt: c.timestamp,
      })),
    });
  }

  async completeDogTrack({
    data,
    context,
  }: {
    data: z.infer<typeof schema.completeDogTrack>;
    context: RequestContext;
  }): Promise<DogTrack> {
    const distance = 100; // calculate distance

    return this.database.updateDogTrack({
      dogTrackId: data.dogTrackId,
      endedAt: new Date(),
      distance,
    });
  }

  async deleteDogTrack({
    data,
    context,
  }: {
    data: z.infer<typeof schema.deleteDogTrack>;
    context: RequestContext;
  }): Promise<number> {
    return this.database.deleteDogTrack({
      dogTrackId: data.dogTrackId,
    });
  }

  // async getOriginalTrackCoordinates({
  //   data,
  //   context,
  // }: {
  //   data: z.infer<typeof schema.getOriginalTrackCoordinates>;
  //   context: RequestContext;
  // }): Promise<Coordinate[]> {
  //   const coordinates = await this.database.getOriginalTrackCoordinates({
  //     originalTrackId: data.originalTrackId,
  //   });

  //   if (!coordinates) {
  //     throw new NotFoundError("Original track not found");
  //   }

  //   return coordinates;
  // }
}
