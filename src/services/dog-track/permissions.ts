import { RequestContext } from "../../api/request";
import { Database } from "../../data/database";
import { z } from "zod";
import { ServicePermissionsBase } from "../permissions";

import * as schema from "./schema";

export class DogTrackServicePermissions extends ServicePermissionsBase {
  constructor({ database }: { database: Database }) {
    super({ database });
  }

  async createDogTrack({
    data,
    context,
  }: {
    data: z.infer<typeof schema.createDogTrack>;
    context: RequestContext;
  }) {
    const isDogEditor = await this.isDogEditor({
      dogId: data.dogId,
      userId: context.userId,
    });
    const isOriginalTrackOwner = await this.isOriginalTrackOwner({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
    return isDogEditor && isOriginalTrackOwner;
  }

  async addDogTrackCoordinates({
    data,
    context,
  }: {
    data: z.infer<typeof schema.addDogTrackCoordinates>;
    context: RequestContext;
  }) {
    return this.isDogTrackOwner({
      dogTrackId: data.dogTrackId,
      userId: context.userId,
    });
  }

  async completeDogTrack({
    data,
    context,
  }: {
    data: z.infer<typeof schema.completeDogTrack>;
    context: RequestContext;
  }) {
    return this.isDogTrackOwner({
      dogTrackId: data.dogTrackId,
      userId: context.userId,
    });
  }

  async deleteDogTrack({
    data,
    context,
  }: {
    data: z.infer<typeof schema.deleteDogTrack>;
    context: RequestContext;
  }) {
    return this.isDogTrackOwner({
      dogTrackId: data.dogTrackId,
      userId: context.userId,
    });
  }

  async getDogTrackCoordinates({
    data,
    context,
  }: {
    data: z.infer<typeof schema.getDogTrackCoordinates>;
    context: RequestContext;
  }) {
    return this.isDogTrackEditor({
      dogTrackId: data.dogTrackId,
      userId: context.userId,
    });
  }
}
