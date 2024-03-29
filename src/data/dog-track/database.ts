import { PrismaClient, Prisma } from "@prisma/client";
import { Dog, DogTrack, Coordinate, DogTrackCoordinates } from "../entities";
import { mapDbDogTrackToDogTrack } from "../mappers";

export class DogTrackDatabase {
  private prismaClient: PrismaClient;

  constructor({ prismaClient }: { prismaClient: PrismaClient }) {
    this.prismaClient = prismaClient;
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
