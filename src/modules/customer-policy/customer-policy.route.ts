import { Router } from "express";
import { CustomerPolicyController } from "./customer-policy.controller";
import { CustomerPolicyService } from "./customer-policy.service";
import { NxService } from "../../shared/nx-library/nx-service";
import { MailService } from "../../shared/services/mail.service";

const router: Router = Router();
const nx = new NxService();
const ds = new CustomerPolicyService(nx);
const ctrl = new CustomerPolicyController(ds);

router.post("/findAll", ctrl.findAll);
router.post("/", ctrl.create);
router.get("/findById", ctrl.findById);
router.get("/findPolicyById", ctrl.findPolicyById);
router.post("/findPolicyByCustomerId", ctrl.findPolicyByCustomerId);
router.delete("/", ctrl.delete);
router.put("/", ctrl.update);

export default router;
