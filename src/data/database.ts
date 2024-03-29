import { PrismaClient } from "@prisma/client";

import { DogDatabase } from "./dog/Database";
import { DogTrackDatabase } from "./dog-track/Database";
import { OriginalTrackDatabase } from "./original-track/Database";

export class Database {
  private prismaClient: PrismaClient;

  public dog: DogDatabase;
  public originalTrack: OriginalTrackDatabase;
  public dogTrack: DogTrackDatabase;

  constructor({ prismaClient }: { prismaClient: PrismaClient }) {
    this.prismaClient = prismaClient;
    this.dog = new DogDatabase({ prismaClient });
    this.originalTrack = new OriginalTrackDatabase({ prismaClient });
    this.dogTrack = new DogTrackDatabase({ prismaClient });
  }
}
