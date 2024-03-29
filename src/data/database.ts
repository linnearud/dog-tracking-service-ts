import { PrismaClient, Prisma } from "@prisma/client";
import {
  Dog,
  DogTrack,
  OriginalTrack,
  Coordinate,
  DogTrackCoordinates,
} from "./entities";
import { mapDbTrackToTrackInfo, mapDbDogTrackToDogTrack } from "./mappers";

export class Database {
  private prismaClient: PrismaClient;

  constructor({ prismaClient }: { prismaClient: PrismaClient }) {
    this.prismaClient = prismaClient;
  }

  // DOGS

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

  async listDogTracksByOriginalTrackIdAndUserId({
    originalTrackId,
    userId,
  }: {
    originalTrackId: number;
    userId: string;
  }): Promise<DogTrack[]> {
    const dbTracks = await this.prismaClient.dogTrack.findMany({
      where: {
        originalTrackId,
        dog: {
          userAccess: {
            some: {
              userId: {
                equals: userId,
              },
            },
          },
        },
      },
      include: {
        track: true,
        originalTrack: { include: { track: true } },
        dog: true,
      },
    });

    return dbTracks.map(mapDbDogTrackToDogTrack);
  }

  async createOriginalTrack({
    startLat,
    startLong,
    startType,
    accessRole,
    userId,
  }: {
    startLat: number;
    startLong: number;
    startType: "HOOF" | "BLOOD_AND_HOOF";
    accessRole: "OWNER" | "EDITOR";
    userId: string;
  }): Promise<OriginalTrack> {
    const dbTrack = await this.prismaClient.originalTrack.create({
      data: {
        createdByUserId: userId,
        track: {
          create: {
            coordinates: {
              create: [{ lat: startLat, long: startLong, type: startType }],
            },
          },
        },
      },
      include: { track: true },
    });

    return {
      id: dbTrack.id,
      ...mapDbTrackToTrackInfo(dbTrack.track),
    };
  }

  async createDogTrack({
    dogId,
    originalTrackId,
    startLat,
    startLong,
    userId,
  }: {
    dogId: number;
    originalTrackId: number;
    startLat: number;
    startLong: number;
    userId: string;
  }): Promise<DogTrack> {
    const dbDogTrack = await this.prismaClient.$transaction(async (tx) => {
      const track = await tx.track.create({
        data: {
          coordinates: {
            create: [{ lat: startLat, long: startLong, type: "DOG" }],
          },
        },
      });

      return tx.dogTrack.create({
        data: {
          originalTrackId,
          dogId,
          trackId: track.id,
          createdByUserId: userId,
        },
        include: {
          track: true,
          originalTrack: { include: { track: true } },
          dog: true,
        },
      });
    });

    return mapDbDogTrackToDogTrack(dbDogTrack);
  }

  async updateDogTrack({
    dogTrackId,
    distance,
    endedAt,
    description,
    weather,
  }: {
    dogTrackId: number;
    distance?: number;
    endedAt?: Date;
    description?: string;
    weather?: string;
  }): Promise<DogTrack> {
    const dbDogTrack = await this.prismaClient.dogTrack.update({
      where: {
        id: dogTrackId,
      },
      data: {
        track: {
          update: {
            ...(endedAt ? { endedAt } : {}),
            ...(description ? { description } : {}),
            ...(weather ? { weather } : {}),
            ...(distance ? { distance } : {}),
          },
        },
      },
      include: {
        track: true,
        originalTrack: { include: { track: true } },
        dog: true,
      },
    });

    return mapDbDogTrackToDogTrack(dbDogTrack);
  }

  async getDogTrackById({ id }: { id: number }): Promise<DogTrack | undefined> {
    const dbTrack = await this.prismaClient.dogTrack.findUnique({
      where: {
        id,
      },
      include: {
        track: true,
        originalTrack: { include: { track: true } },
        dog: true,
      },
    });

    if (!dbTrack) return undefined;

    return mapDbDogTrackToDogTrack(dbTrack);
  }

  async getDockTrackDog({ dogTrackId }: { dogTrackId: number }) {
    const track = await this.prismaClient.dogTrack.findUnique({
      where: {
        id: dogTrackId,
      },
      include: { dog: true },
    });

    return track?.dog;
  }

  async listOriginalTracksByUser({
    userId,
  }: {
    userId: string;
  }): Promise<OriginalTrack[]> {
    const tracks = await this.prismaClient.originalTrack.findMany({
      where: {
        createdByUserId: userId,
      },
      include: { track: true },
    });

    return tracks.map((track) => ({
      id: track.id,
      ...mapDbTrackToTrackInfo(track.track),
    }));
  }

  async getOriginalTrackById({
    id,
  }: {
    id: number;
  }): Promise<OriginalTrack | undefined> {
    const dbTrack = await this.prismaClient.originalTrack.findUnique({
      where: {
        id,
      },
      include: { track: true },
    });

    if (!dbTrack) return undefined;

    return {
      id: dbTrack.id,
      ...mapDbTrackToTrackInfo(dbTrack.track),
    };
  }

  async dogTrackByIdAndUserExists({
    dogTrackId,
    userId,
  }: {
    dogTrackId: number;
    userId: string;
  }): Promise<boolean> {
    const dbTrack = await this.prismaClient.dogTrack.findUnique({
      where: {
        id: dogTrackId,
        createdByUserId: userId,
      },
    });

    return Boolean(dbTrack);
  }

  async originalTrackByIdAndUserExists({
    originalTrackId,
    userId,
  }: {
    originalTrackId: number;
    userId: string;
  }): Promise<boolean> {
    const dbTrack = await this.prismaClient.originalTrack.findUnique({
      where: {
        id: originalTrackId,
        createdByUserId: userId,
      },
    });

    return Boolean(dbTrack);
  }

  async updateOriginalTrack({
    originalTrackId,
    distance,
    endedAt,
    description,
    weather,
  }: {
    originalTrackId: number;
    distance?: number;
    endedAt?: Date;
    description?: string;
    weather?: string;
  }): Promise<OriginalTrack> {
    const dbTrack = await this.prismaClient.originalTrack.update({
      where: {
        id: originalTrackId,
      },
      data: {
        track: {
          update: {
            ...(endedAt ? { endedAt } : {}),
            ...(description ? { description } : {}),
            ...(weather ? { weather } : {}),
            ...(distance ? { distance } : {}),
          },
        },
      },
      include: { track: true },
    });

    return {
      id: dbTrack.id,
      ...mapDbTrackToTrackInfo(dbTrack.track),
    };
  }

  async deleteOriginalTrack({
    originalTrackId,
  }: {
    originalTrackId: number;
  }): Promise<number> {
    const dbOriginalTrack = await this.prismaClient.originalTrack.delete({
      where: {
        id: originalTrackId,
      },
    });

    return dbOriginalTrack.id;
  }

  async deleteDogTrack({
    dogTrackId,
  }: {
    dogTrackId: number;
  }): Promise<number> {
    const dbTrack = await this.prismaClient.dogTrack.delete({
      where: {
        id: dogTrackId,
      },
    });

    return dbTrack.id;
  }

  async createOriginalTrackCoordinates({
    originalTrackId,
    coordinates,
  }: {
    originalTrackId: number;
    coordinates: {
      lat: number;
      long: number;
      createdAt: Date;
      type: "HOOF" | "BLOOD_AND_HOOF";
    }[];
  }): Promise<Coordinate[]> {
    const dbTrack = await this.prismaClient.originalTrack.update({
      where: {
        id: originalTrackId,
      },
      data: {
        track: {
          update: {
            coordinates: {
              create: coordinates.map((c) => ({
                lat: c.lat,
                long: c.long,
                type: c.type,
                createdAt: c.createdAt,
              })),
            },
          },
        },
      },
      include: { track: { include: { coordinates: true } } },
    });

    return dbTrack.track.coordinates;
  }

  async createDogTrackCoordinates({
    dogTrackId,
    coordinates,
  }: {
    dogTrackId: number;
    coordinates: {
      lat: number;
      long: number;
      createdAt: Date;
    }[];
  }): Promise<Coordinate[]> {
    const dbTrack = await this.prismaClient.dogTrack.update({
      where: {
        id: dogTrackId,
      },
      data: {
        track: {
          update: {
            coordinates: {
              create: coordinates.map((c) => ({
                lat: c.lat,
                long: c.long,
                type: "DOG",
                createdAt: c.createdAt,
              })),
            },
          },
        },
      },
      include: { track: { include: { coordinates: true } } },
    });

    return dbTrack.track.coordinates;
  }

  async getOriginalTrackCoordinates({
    originalTrackId,
  }: {
    originalTrackId: number;
  }): Promise<Coordinate[] | undefined> {
    const dbTrack = await this.prismaClient.originalTrack.findUnique({
      where: {
        id: originalTrackId,
      },
      include: {
        track: { include: { coordinates: { orderBy: { createdAt: "asc" } } } },
      },
    });

    return dbTrack?.track.coordinates;
  }

  async getDogTrackCoordinates({
    dogTrackId,
  }: {
    dogTrackId: number;
  }): Promise<DogTrackCoordinates | undefined> {
    const dbTrack = await this.prismaClient.dogTrack.findUnique({
      where: {
        id: dogTrackId,
      },
      include: {
        track: { include: { coordinates: true } },
        originalTrack: {
          include: {
            track: {
              include: { coordinates: { orderBy: { createdAt: "asc" } } },
            },
          },
        },
      },
    });

    return dbTrack
      ? {
          dog: dbTrack.track.coordinates,
          original: dbTrack.originalTrack.track.coordinates,
        }
      : undefined;
  }
}
