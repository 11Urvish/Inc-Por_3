import { Router } from "express";
import { NxService } from "../../shared/nx-library/nx-service";
import { MailService } from "../../shared/services/mail.service";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";

const router: Router = Router();
const nx = new NxService();
const mailService = new MailService();
const ds = new DashboardService(nx, mailService);
const ctrl = new DashboardController(ds);

router.post("/findAdminMasterData", ctrl.findAdminMasterData);
router.post("/findCustomerDashboard", ctrl.findCustomerDashboard);

export default router;
