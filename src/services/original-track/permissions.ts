import { RequestContext } from "../../api/request";
import { Database } from "../../data/database";
import { z } from "zod";
import { ServicePermissionsBase } from "../permissions";

import * as schema from "./schema";

export class OriginalTrackServicePermissions extends ServicePermissionsBase {
  constructor({ database }: { database: Database }) {
    super({ database });
  }

  listOriginalTracks = ({
    context,
  }: {
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isAuthenticated({ context });
  };

  createOriginalTrack = ({
    context,
  }: {
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isAuthenticated({ context });
  };

  addOriginalTrackCoordinates = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.addOriginalTrackCoordinates>;
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isOriginalTrackOwner({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
  };

  completeOriginalTrack = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.completeOriginalTrack>;
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isOriginalTrackOwner({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
  };

  deleteOriginalTrack = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.deleteOriginalTrack>;
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isOriginalTrackOwner({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
  };

  getOriginalTrackCoordinates = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.getOriginalTrackCoordinates>;
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isOriginalTrackOwner({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
  };

  listDogTracks = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.listDogTracks>;
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isOriginalTrackOwner({
      originalTrackId: data.originalTrackId,
      userId: context.userId,
    });
  };
}
