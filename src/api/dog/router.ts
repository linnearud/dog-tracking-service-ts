import { z } from "zod";
import { Router } from "express";
import { handleRequest } from "../request";
import { DogService } from "../../services/dog/service";
import { DogServicePermissions } from "../../services/dog/permissions";
import * as schemas from "../../services/dog/schema";

export class DogRouter {
  private _dogService: DogService;
  private _dogPermissions: DogServicePermissions;
  private _router = Router();

  constructor({
    dogService,
    dogPermissions,
  }: {
    dogService: DogService;
    dogPermissions: DogServicePermissions;
  }) {
    this._dogService = dogService;
    this._dogPermissions = dogPermissions;
    this.configureRoutes();
  }

  private configureRoutes() {
    this._router.get("/", async (req, res) =>
      handleRequest({
        inputSchema: schemas.listDogsSchema,
        requestHandler: this._dogService.listDogs,
        permissionHandler: this._dogPermissions.listDogs,
        req,
        res,
      }),
    );
    this._router.post("/", async (req, res) =>
      handleRequest({
        inputSchema: schemas.createDogSchema,
        requestHandler: this._dogService.createDog,
        permissionHandler: this._dogPermissions.createDog,
        req,
        res,
      }),
    );
    this._router.put("/:dogId", async (req, res) =>
      handleRequest({
        inputSchema: schemas.updateDogSchema,
        requestHandler: this._dogService.updateDog,
        permissionHandler: this._dogPermissions.updateDog,
        req,
        res,
      }),
    );
    this._router.get("/:dogId/dog-tracks", async (req, res) =>
      handleRequest({
        inputSchema: schemas.listDogTracksSchema,
        requestHandler: this._dogService.listDogTracks,
        permissionHandler: this._dogPermissions.listDogTracks,
        req,
        res,
      }),
    );
    this._router.delete("/:dogId", async (req, res) =>
      handleRequest({
        inputSchema: schemas.deleteDogSchema,
        requestHandler: this._dogService.deleteDog,
        permissionHandler: this._dogPermissions.deleteDog,
        req,
        res,
      }),
    );
  }

  get router() {
    return this._router;
  }
}
