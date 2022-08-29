import express, { Router } from "express";
import {
  checkReachable,
  postSignup,
  postSignin,
  getAdvisors,
  getStudents,
  getStudentRequest,
  getAdvisorDetails,
  getListOfStaffForPanel,
  postCreatePanel,
  getPanelDetails,
  getAllPanels,
  postClosePanel,
} from "../controllers/admin";
import { isAdminAuthenticated } from "../middlewares/isRoleAuthenticated";

const router: Router = express.Router();

router.get("/", checkReachable);

router.post("/signup", postSignup);

router.post("/signin", postSignin);

router.get("/advisors", isAdminAuthenticated, getAdvisors);

router.get("/advisor/:id", isAdminAuthenticated, getAdvisorDetails);

router.get("/listforpanel", isAdminAuthenticated, getListOfStaffForPanel);

router.post("/panel", isAdminAuthenticated, postCreatePanel);

router.get("/panel/:id", isAdminAuthenticated, getPanelDetails);

router.get("/panels", isAdminAuthenticated, getAllPanels);

router.post("/close/panel", isAdminAuthenticated, postClosePanel);

router.get("/students", isAdminAuthenticated, getStudents);

router.get("/student/:id/request", isAdminAuthenticated, getStudentRequest);

export default router;
