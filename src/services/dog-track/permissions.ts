import { RequestContext } from "../../api/request";
import { Database } from "../../data/database";
import { z } from "zod";
import { ServicePermissionsBase } from "../permissions";

import * as schema from "./schema";

export class DogTrackServicePermissions extends ServicePermissionsBase {
  constructor({ database }: { database: Database }) {
    super({ database });
  }

  createDogTrack = async ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.createDogTrack>;
    context: RequestContext;
  }): Promise<boolean> => {
    const isDogEditor = await this.isDogEditor({
      dogId: data.dogId,
      userId: context.userId,
    });
    const isOriginalTrackOwner = await this.isOriginalTrackOwner({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
    return isDogEditor && isOriginalTrackOwner;
  };

  addDogTrackCoordinates = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.addDogTrackCoordinates>;
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isDogTrackOwner({
      dogTrackId: data.dogTrackId,
      userId: context.userId,
    });
  };

  completeDogTrack = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.completeDogTrack>;
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isDogTrackOwner({
      dogTrackId: data.dogTrackId,
      userId: context.userId,
    });
  };

  deleteDogTrack = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.deleteDogTrack>;
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isDogTrackOwner({
      dogTrackId: data.dogTrackId,
      userId: context.userId,
    });
  };

  getDogTrackCoordinates = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.getDogTrackCoordinates>;
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isDogTrackEditor({
      dogTrackId: data.dogTrackId,
      userId: context.userId,
    });
  };
}
