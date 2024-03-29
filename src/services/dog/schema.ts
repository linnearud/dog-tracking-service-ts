import { z } from "zod";
import { RequestContext } from "../../api/request";

export const listDogsSchema = z.object({});

export const createDogSchema = z.object({
  name: z.string(),
  breed: z.string().optional(),
  birthDate: z.coerce.date(),
});

export const updateDogSchema = z.object({
  dogId: z.coerce.number(),
  name: z.string().optional(),
  breed: z.string().optional(),
  birthDate: z.coerce.date().optional(),
});

export const deleteDogSchema = z.object({
  dogId: z.coerce.number(),
});

export const listDogTracksSchema = z.object({
  dogId: z.coerce.number(),
});