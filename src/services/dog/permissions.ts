import { RequestContext } from "../../api/request";
import { ForbiddenError } from "../../utils/errors";
import { Database } from "../../data/database";
import { z } from "zod";
import { ServicePermissionsBase } from "../permissions";

import * as schema from "./schema";

export class DogServicePermissions extends ServicePermissionsBase {
  constructor({ database }: { database: Database }) {
    super({ database });
  }

  async listDogs({ context }: { context: RequestContext }) {
    return this.isAuthenticated({ context });
  }

  async createDog({ context }: { context: RequestContext }) {
    return this.isAuthenticated({ context });
  }

  async updateDog({
    data,
    context,
  }: {
    data: z.infer<typeof schema.updateDogSchema>;
    context: RequestContext;
  }) {
    return this.isDogEditor({ dogId: data.dogId, userId: context.userId });
  }

  async deleteDog({
    data,
    context,
  }: {
    data: z.infer<typeof schema.updateDogSchema>;
    context: RequestContext;
  }) {
    return this.isDogOwner({ dogId: data.dogId, userId: context.userId });
  }

  async listDogTracks({
    data,
    context,
  }: {
    data: z.infer<typeof schema.listDogTracksSchema>;
    context: RequestContext;
  }) {
    return this.isDogEditor({ dogId: data.dogId, userId: context.userId });
  }
}
