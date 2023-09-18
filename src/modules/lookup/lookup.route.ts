import { Router } from "express";
import { NxService } from "../../shared/nx-library/nx-service";
import { LookupService } from "../lookup/lookup.service";
import { LookupController } from "./lookup.controller";

const router: Router = Router();
const nx = new NxService();
const ds = new LookupService(nx);
const ctrl = new LookupController(ds);

router.post("/find", ctrl.find);
router.get("/findStatesByCountryId", ctrl.findStatesByCountryId);
export default router;
