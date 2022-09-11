import express, { Router } from "express";
import { getPanelDetails } from "../controllers/admin";
import {
  checkReachable,
  postSignup,
  postSignin,
  postAcceptRequest,
  postRejectRequest,
  postCloseAdvisorRequest,
  getAllStudentRequests,
  getStudentRequest,
  getAdvisorForm,
  postAdvisorMarks,
  getAssignedPanelDetails,
  postPanelMidMarks,
  postPanelFinalMarks,
} from "../controllers/advisor";
import { isAdvisorsContract } from "../middlewares/isAdvisorAuthorized";
import {
  isAdvisorAuthenticated,
  isInPanel,
} from "../middlewares/isRoleAuthenticated";

const router: Router = express.Router();

router.get("/", checkReachable);

router.post("/signup", postSignup);

router.post("/signin", postSignin);

router.post(
  "/accept/request",
  isAdvisorAuthenticated,
  isAdvisorsContract,
  postAcceptRequest
);

router.post(
  "/reject/request",
  isAdvisorAuthenticated,
  isAdvisorsContract,
  postRejectRequest
);

router.post(
  "/close/request",
  isAdvisorAuthenticated,
  isAdvisorsContract,
  postCloseAdvisorRequest
);

router.get("/requests", isAdvisorAuthenticated, getAllStudentRequests);

router.get(
  "/request/:id",
  isAdvisorAuthenticated,
  isAdvisorsContract,
  getStudentRequest
);

router.get(
  "/form/:id",
  isAdvisorAuthenticated,
  isAdvisorsContract,
  getAdvisorForm
);

router.post(
  "/contract/marks",
  isAdvisorAuthenticated,
  isAdvisorsContract,
  postAdvisorMarks
);

router.get("/panel", isAdvisorAuthenticated, getAssignedPanelDetails);

router.post(
  "/contract/midmarks",
  isAdvisorAuthenticated,
  isInPanel,
  postPanelMidMarks
);

router.post(
  "/contract/finalmarks",
  isAdvisorAuthenticated,
  isInPanel,
  postPanelFinalMarks
);

export default router;
