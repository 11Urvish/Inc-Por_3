import { Router } from "express";
const passport = require("passport");
const passportJwt = passport.authenticate("jwt", { session: false });

import authRoute from "../modules/auth/auth.route";
import dashboardRoute from "../modules/dashboard/dashboard.route";
import fileUploadRoute from "../modules/file-upload/file-upload.route";
import userRoute from "../modules/user/user.route";
import companyRoute from "../modules/company/company.route";
import customerRoute from "../modules/customer/customer.route";
import customerPolicyRoute from "../modules/customer-policy/customer-policy.route";
import lookupRoute from "../modules/lookup/lookup.route";
import customerPolicyDocRoute from "../modules/customer-policy-doc/customer-policy-doc.route";

const router: Router = Router();

router.use("/auth", authRoute);
router.use("/dashboard", passportJwt, dashboardRoute);
router.use("/file-upload", fileUploadRoute);
router.use("/user", passportJwt, userRoute);
router.use("/company", passportJwt, companyRoute);
router.use("/customer", passportJwt, customerRoute);
router.use("/customer-policy", passportJwt, customerPolicyRoute);
router.use("/customer-policy-doc", passportJwt, customerPolicyDocRoute);
router.use("/lookup", passportJwt, lookupRoute);

export default router;
