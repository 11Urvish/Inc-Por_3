import { Router } from "express";
import { CompanyController } from "./company.controller";
import { CompanyService } from "./company.service";
import { NxService } from "../../shared/nx-library/nx-service";

const router: Router = Router();
const nx = new NxService();
const ds = new CompanyService(nx);
const ctrl = new CompanyController(ds);

router.post("/findAll", ctrl.findAll);
router.post("/", ctrl.create);
router.get("/findById", ctrl.findById);
router.delete("/", ctrl.delete);
router.put("/", ctrl.update);
export default router;
