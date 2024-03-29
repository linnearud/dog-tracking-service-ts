import { Database } from "../data/database";
import { RequestContext } from "../api/request";
import { NotFoundError } from "../utils/errors";

export class ServicePermissionsBase {
  database: Database;

  constructor({ database }: { database: Database }) {
    this.database = database;
  }

  isAuthenticated = ({
    context,
  }: {
    context: RequestContext;
  }): Promise<boolean> => {
    return new Promise((resolve) => resolve(Boolean(context.userId)));
  };

  isOriginalTrackOwner = ({
    originalTrackId,
    userId,
  }: {
    originalTrackId: number;
    userId: string;
  }): Promise<boolean> => {
    return this.database.originalTrackByIdAndUserExists({
      originalTrackId,
      userId,
    });
  };

  isDogTrackOwner = ({
    dogTrackId,
    userId,
  }: {
    dogTrackId: number;
    userId: string;
  }): Promise<boolean> => {
    return this.database.dogTrackByIdAndUserExists({
      dogTrackId,
      userId,
    });
  };

  isDogTrackEditor = async ({
    dogTrackId,
    userId,
  }: {
    dogTrackId: number;
    userId: string;
  }) => {
    const dog = await this.database.getDockTrackDog({
      dogTrackId,
    });

    if (!dog) {
      throw new NotFoundError("Dog track not found");
    }

    return this.isDogEditor({ dogId: dog.id, userId });
  };

  isDogEditor = async ({
    dogId,
    userId,
  }: {
    dogId: number;
    userId: string;
  }) => {
    const accessRole = await this.database.getDogAccess({
      dogId: dogId,
      userId: userId,
    });

    return Boolean(accessRole);
  };

  isDogOwner = async ({ dogId, userId }: { dogId: number; userId: string }) => {
    const accessRole = await this.database.getDogAccess({
      dogId: dogId,
      userId: userId,
    });

    return accessRole === "OWNER";
  };
}
