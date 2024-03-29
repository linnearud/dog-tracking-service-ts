import { PrismaClient, Prisma } from "@prisma/client";
import { DogTrack, OriginalTrack, Coordinate } from "../entities";
import { mapDbTrackToTrackInfo, mapDbDogTrackToDogTrack } from "../mappers";

export class OriginalTrackDatabase {
  private prismaClient: PrismaClient;

  constructor({ prismaClient }: { prismaClient: PrismaClient }) {
    this.prismaClient = prismaClient;
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
}
