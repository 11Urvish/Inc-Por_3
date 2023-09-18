import { Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

import { FileUploadService } from "./file-upload.service";
import { NxService } from "../../shared/nx-library/nx-service";
import { FileUploadController } from "./file-upload.controller";

const router: Router = Router();
const nx = new NxService();
const ds = new FileUploadService(nx);
const ctrl = new FileUploadController(ds);

router.post("/uploadFile", upload.single("file"), ctrl.uploadFile);

export default router;
