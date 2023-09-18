import { Router } from "express";
import { CompanyController } from "./customer-policy-doc.controller";
import { CompanyService } from "./customer-policy-doc.service";
import { NxService } from "../../shared/nx-library/nx-service";

const router: Router = Router();
const nx = new NxService();
const ds = new CompanyService(nx);
const ctrl = new CompanyController(ds);

router.put("/", ctrl.update);
router.put("/approvedByAgent", ctrl.approvedByAgent);
export default router;
