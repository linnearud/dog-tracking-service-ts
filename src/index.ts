import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { auth } from "express-oauth2-jwt-bearer";

import { DogRouter } from "./api/dog";
import { OriginalTrackRouter } from "./api/original-track";
import { DogTrackRouter } from "./api/dog-track";

import { DogService } from "./services/dog/service";
import { DogServicePermissions } from "./services/dog/permissions";
import { OriginalTrackService } from "./services/original-track/service";
import { OriginalTrackServicePermissions } from "./services/original-track/permissions";
import { DogTrackService } from "./services/dog-track/service";
import { DogTrackServicePermissions } from "./services/dog-track/permissions";

import { Database } from "./data/database";

const prisma = new PrismaClient();
const database = new Database({ prismaClient: prisma });

const dogService = new DogService({ database });
const dogPermissions = new DogServicePermissions({ database });
const dogRouter = new DogRouter({ dogService, dogPermissions });

const originalTrackService = new OriginalTrackService({ database });
const originalTrackPermissions = new OriginalTrackServicePermissions({
  database,
});
const originalTrackRouter = new OriginalTrackRouter({
  originalTrackService,
  originalTrackPermissions,
});

const dogTrackService = new DogTrackService({ database });
const dogTrackPermissions = new DogTrackServicePermissions({
  database,
});
const dogTrackRouter = new DogTrackRouter({
  dogTrackService,
  dogTrackPermissions,
});

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  auth({
    issuerBaseURL: "https://devpack.eu.auth0.com/",
    audience: "dts-localhost",
  }),
);

const port = process.env.PORT;

app.use("/dogs", dogRouter.router);
app.use("/original-tracks", originalTrackRouter.router);
app.use("/dog-tracks", dogTrackRouter.router);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
