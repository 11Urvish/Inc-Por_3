import { Router } from "express";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { NxService } from "../../shared/nx-library/nx-service";
import { MailService } from "../../shared/services/mail.service";

const router: Router = Router();
const nx = new NxService();
const mailService = new MailService();
const ds = new CustomerService(nx, mailService);
const ctrl = new CustomerController(ds);

router.post("/findAll", ctrl.findAll);
router.post("/", ctrl.create);
router.get("/findById", ctrl.findById);
router.get("/findByUserId", ctrl.findByUserId);
router.delete("/", ctrl.delete);
router.put("/", ctrl.update);

export default router;
