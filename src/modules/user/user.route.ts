import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { NxService } from "../../shared/nx-library/nx-service";
import { MailService } from "../../shared/services/mail.service";

const router: Router = Router();
const nx = new NxService();
const mailService = new MailService();
const ds = new UserService(nx, mailService);
const ctrl = new UserController(ds);

router.post("/findAll", ctrl.findAll);
router.get("/findById", ctrl.findById);
router.get("/findAgent", ctrl.findAgentByCompanyId);
router.post("/", ctrl.create);
router.post("/changePassword", ctrl.changePassword);
router.delete("/", ctrl.delete);
router.put("/", ctrl.update);
export default router;
