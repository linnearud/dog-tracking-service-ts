import { RequestContext } from "../../api/request";
import { ForbiddenError } from "../../utils/errors";
import { Database } from "../../data/database";
import { Dog, DogTrack } from "../../data/entities";
import { z } from "zod";

import * as schema from "./schema";

export class DogService {
  private database: Database;

  constructor({ database }: { database: Database }) {
    this.database = database;
  }

  async listDogs({ context }: { context: RequestContext }): Promise<Dog[]> {
    return this.database.listDogsByUser({ userId: context.userId });
  }

  async createDog({
    data,
    context,
  }: {
    data: z.infer<typeof schema.createDogSchema>;
    context: RequestContext;
  }): Promise<Dog> {
    return this.database.createDog({
      name: data.name,
      userId: context.userId,
      accessRole: "OWNER",
    });
  }

  async updateDog({
    data,
    context,
  }: {
    data: z.infer<typeof schema.updateDogSchema>;
    context: RequestContext;
  }): Promise<Dog> {
    return this.database.updateDog({
      name: data.name,
      breed: data.breed,
      dogId: data.dogId,
    });
  }

  async deleteDog({
    data,
    context,
  }: {
    data: z.infer<typeof schema.updateDogSchema>;
    context: RequestContext;
  }): Promise<number> {
    return this.database.deleteDog({
      dogId: data.dogId,
    });
  }

  async listDogTracks({
    data,
    context,
  }: {
    data: z.infer<typeof schema.listDogTracksSchema>;
    context: RequestContext;
  }): Promise<DogTrack[]> {
    return this.database.listDogTracksByDogId({ dogId: data.dogId });
  }
}
