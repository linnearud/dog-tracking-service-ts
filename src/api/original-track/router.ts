import { z } from "zod";
import { Router } from "express";
import { handleRequest } from "../request";
import { OriginalTrackService } from "../../services/original-track/service";
import { OriginalTrackServicePermissions } from "../../services/original-track/permissions";
import * as schemas from "../../services/original-track/schema";

export class OriginalTrackRouter {
  private _originalTrackService: OriginalTrackService;
  private _originalTrackPermissions: OriginalTrackServicePermissions;
  private _router = Router();

  constructor({
    originalTrackService,
    originalTrackPermissions,
  }: {
    originalTrackService: OriginalTrackService;
    originalTrackPermissions: OriginalTrackServicePermissions;
  }) {
    this._originalTrackService = originalTrackService;
    this._originalTrackPermissions = originalTrackPermissions;
    this.configureRoutes();
  }

  private configureRoutes() {
    this._router.get("/", async (req, res) =>
      handleRequest({
        inputSchema: schemas.listOriginalTracks,
        requestHandler: this._originalTrackService.listOriginalTracks,
        permissionHandler: this._originalTrackPermissions.listOriginalTracks,
        req,
        res,
      }),
    );
    this._router.post("/", async (req, res) =>
      handleRequest({
        inputSchema: schemas.createOriginalTrack,
        requestHandler: this._originalTrackService.createOriginalTrack,
        permissionHandler: this._originalTrackPermissions.createOriginalTrack,
        req,
        res,
      }),
    );
    this._router.post("/:originalTrackId/coordinates", async (req, res) =>
      handleRequest({
        inputSchema: schemas.addOriginalTrackCoordinates,
        requestHandler: this._originalTrackService.addOriginalTrackCoordinates,
        permissionHandler:
          this._originalTrackPermissions.addOriginalTrackCoordinates,
        req,
        res,
      }),
    );
    this._router.get("/:originalTrackId/coordinates", async (req, res) =>
      handleRequest({
        inputSchema: schemas.getOriginalTrackCoordinates,
        requestHandler: this._originalTrackService.getOriginalTrackCoordinates,
        permissionHandler:
          this._originalTrackPermissions.getOriginalTrackCoordinates,
        req,
        res,
      }),
    );
    this._router.put("/:originalTrackId/complete", async (req, res) =>
      handleRequest({
        inputSchema: schemas.completeOriginalTrack,
        requestHandler: this._originalTrackService.completeOriginalTrack,
        permissionHandler: this._originalTrackPermissions.completeOriginalTrack,
        req,
        res,
      }),
    );
    this._router.delete("/:originalTrackId", async (req, res) =>
      handleRequest({
        inputSchema: schemas.deleteOriginalTrack,
        requestHandler: this._originalTrackService.deleteOriginalTrack,
        permissionHandler: this._originalTrackPermissions.deleteOriginalTrack,
        req,
        res,
      }),
    );
    this._router.get("/:originalTrackId/dog-tracks", async (req, res) =>
      handleRequest({
        inputSchema: schemas.listDogTracks,
        requestHandler: this._originalTrackService.listDogTracks,
        permissionHandler: this._originalTrackPermissions.listDogTracks,
        req,
        res,
      }),
    );
  }

  get router() {
    return this._router;
  }
}
