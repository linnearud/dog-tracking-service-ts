import { RequestContext } from "../../api/request";
import { Database } from "../../data/database";
import { z } from "zod";
import { ServicePermissionsBase } from "../permissions";

import * as schema from "./schema";

export class OriginalTrackServicePermissions extends ServicePermissionsBase {
  constructor({ database }: { database: Database }) {
    super({ database });
  }

  async listOriginalTracks({ context }: { context: RequestContext }) {
    return this.isAuthenticated({ context });
  }

  async createOriginalTrack({ context }: { context: RequestContext }) {
    return this.isAuthenticated({ context });
  }

  async addOriginalTrackCoordinates({
    data,
    context,
  }: {
    data: z.infer<typeof schema.addOriginalTrackCoordinates>;
    context: RequestContext;
  }) {
    return this.isOriginalTrackOwner({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
  }

  async completeOriginalTrack({
    data,
    context,
  }: {
    data: z.infer<typeof schema.completeOriginalTrack>;
    context: RequestContext;
  }) {
    return this.isOriginalTrackOwner({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
  }

  async deleteOriginalTrack({
    data,
    context,
  }: {
    data: z.infer<typeof schema.deleteOriginalTrack>;
    context: RequestContext;
  }) {
    return this.isOriginalTrackOwner({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
  }

  async getOriginalTrackCoordinates({
    data,
    context,
  }: {
    data: z.infer<typeof schema.getOriginalTrackCoordinates>;
    context: RequestContext;
  }) {
    return this.isOriginalTrackOwner({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
  }

  async listDogTracks({
    data,
    context,
  }: {
    data: z.infer<typeof schema.listDogTracks>;
    context: RequestContext;
  }) {
    return this.isOriginalTrackOwner({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
  }
}
