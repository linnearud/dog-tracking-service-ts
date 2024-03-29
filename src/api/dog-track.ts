import { z } from "zod";
import { Router } from "express";
import { handleRequest } from "./request";
import { DogTrackService } from "../services/dog-track/service";
import { DogTrackServicePermissions } from "../services/dog-track/permissions";
import * as schemas from "../services/dog-track/schema";

export class DogTrackRouter {
  private _dogTrackService: DogTrackService;
  private _dogTrackPermissions: DogTrackServicePermissions;
  private _router = Router();

  constructor({
    dogTrackService,
    dogTrackPermissions,
  }: {
    dogTrackService: DogTrackService;
    dogTrackPermissions: DogTrackServicePermissions;
  }) {
    this._dogTrackService = dogTrackService;
    this._dogTrackPermissions = dogTrackPermissions;
    this.configureRoutes();
  }

  private configureRoutes() {
    this._router.post("/", async (req, res) =>
      handleRequest({
        inputSchema: schemas.createDogTrack,
        requestHandler: this._dogTrackService.createDogTrack,
        permissionHandler: this._dogTrackPermissions.createDogTrack,
        req,
        res,
      }),
    );
    this._router.post("/:dogTrackId/coordinates", async (req, res) =>
      handleRequest({
        inputSchema: schemas.addDogTrackCoordinates,
        requestHandler: this._dogTrackService.addDogTrackCoordinates,
        permissionHandler: this._dogTrackPermissions.addDogTrackCoordinates,
        req,
        res,
      }),
    );
    // this._router.get("/:dogTrackId/coordinates", async (req, res) =>
    //   handleRequest({
    //     inputSchema: schemas.getDogTrackCoordinates,
    //     requestHandler: this._dogTrackService.getDogTrackCoordinates,
    //     permissionHandler:
    //       this._dogTrackPermissions.getDogTrackCoordinates,
    //     req,
    //     res,
    //   }),
    // );
    this._router.put("/:dogTrackId/complete", async (req, res) =>
      handleRequest({
        inputSchema: schemas.completeDogTrack,
        requestHandler: this._dogTrackService.completeDogTrack,
        permissionHandler: this._dogTrackPermissions.completeDogTrack,
        req,
        res,
      }),
    );
    this._router.delete("/:dogTrackId", async (req, res) =>
      handleRequest({
        inputSchema: schemas.deleteDogTrack,
        requestHandler: this._dogTrackService.deleteDogTrack,
        permissionHandler: this._dogTrackPermissions.deleteDogTrack,
        req,
        res,
      }),
    );
  }

  get router() {
    return this._router;
  }
}
