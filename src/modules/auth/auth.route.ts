import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { NxService } from "../../shared/nx-library/nx-service";
import { MailService } from "../../shared/services/mail.service";

const router: Router = Router();
const nx = new NxService();
const mailService = new MailService();
const ds = new AuthService(nx, mailService);
const ctrl = new AuthController(ds);

router.post("/login", ctrl.login);
router.post("/signin", ctrl.customerLogin);
router.post("/forgotPassword", ctrl.forgotPassword);
export default router;
