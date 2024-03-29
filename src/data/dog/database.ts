import { PrismaClient, Prisma } from "@prisma/client";
import { Dog, DogTrack } from "../entities";
import { mapDbDogTrackToDogTrack } from "../mappers";

export class DogDatabase {
  private prismaClient: PrismaClient;

  constructor({ prismaClient }: { prismaClient: PrismaClient }) {
    this.prismaClient = prismaClient;
  }

  async listDogsByUser({ userId }: { userId: string }): Promise<Dog[]> {
    const dogs = await this.prismaClient.dog.findMany({
      where: {
        userAccess: {
          some: {
            userId: {
              equals: userId,
            },
          },
        },
      },
    });

    return dogs;
  }

  async createDog({
    name,
    userId,
    accessRole,
  }: {
    name: string;
    userId: string;
    accessRole: "EDITOR" | "OWNER";
  }): Promise<Dog> {
    const dog = await this.prismaClient.dog.create({
      data: {
        name,
        userAccess: {
          create: [{ userId: userId, accessRole }],
        },
      },
    });

    return dog;
  }

  async getDogAccess({
    userId,
    dogId,
  }: {
    userId: string;
    dogId: number;
  }): Promise<string | undefined> {
    const dbDogAccess = await this.prismaClient.userAccessOnDog.findUnique({
      where: {
        ["userId_dogId"]: {
          dogId,
          userId,
        },
      },
    });

    return dbDogAccess?.accessRole;
  }

  async deleteDog({ dogId }: { dogId: number }): Promise<number> {
    const dbDog = await this.prismaClient.dog.delete({
      where: {
        id: dogId,
      },
    });

    return dbDog.id;
  }

  async updateDog({
    name,
    breed,
    dogId,
  }: {
    name?: string;
    breed?: string;
    dogId: number;
  }): Promise<Dog> {
    const dbDog = await this.prismaClient.dog.update({
      where: {
        id: dogId,
      },
      data: {
        ...(name ? { name } : {}),
        ...(breed ? { breed } : {}),
      },
    });

    return dbDog;
  }

  async listDogTracksByDogId({
    dogId,
  }: {
    dogId: number;
  }): Promise<DogTrack[]> {
    const dbTracks = await this.prismaClient.dogTrack.findMany({
      where: {
        dogId,
      },
      include: {
        track: true,
        originalTrack: { include: { track: true } },
        dog: true,
      },
    });

    return dbTracks.map(mapDbDogTrackToDogTrack);
  }
}
