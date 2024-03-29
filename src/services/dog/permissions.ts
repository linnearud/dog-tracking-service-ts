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

  listDogs = ({ context }: { context: RequestContext }): Promise<boolean> => {
    return this.isAuthenticated({ context });
  };

  createDog = ({ context }: { context: RequestContext }): Promise<boolean> => {
    return this.isAuthenticated({ context });
  };

  updateDog = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.updateDogSchema>;
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isDogEditor({ dogId: data.dogId, userId: context.userId });
  };

  deleteDog = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.updateDogSchema>;
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isDogOwner({ dogId: data.dogId, userId: context.userId });
  };

  listDogTracks = ({
    data,
    context,
  }: {
    data: z.infer<typeof schema.listDogTracksSchema>;
    context: RequestContext;
  }): Promise<boolean> => {
    return this.isDogEditor({ dogId: data.dogId, userId: context.userId });
  };
}
