import { Request, Response, NextFunction } from "express";
import {
  Signin,
  Signup,
  AllAdvisors,
  AllStudents,
  StudentRequest,
  AdvisorDetails,
  ListOfStaffForPanel,
  CreatePanel,
  PanelDetails,
  AllPanels,
  ClosePanel,
} from "../services/admin";

export const checkReachable = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(200).json({ message: "Student APIs reachabled" });
};

export const postSignup = (req: Request, res: Response, next: NextFunction) => {
  return Signup(req.body.user, res);
};

export const postSignin = (req: Request, res: Response, next: NextFunction) => {
  return Signin(req.body.user, res);
};

export const getAdvisors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return AllAdvisors(res);
};

export const getStudents = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return AllStudents(res);
};

export const getStudentRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return StudentRequest(req.params.id as string, res);
};

export const getAdvisorDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return AdvisorDetails(req.params.id as string, res);
};

export const getListOfStaffForPanel = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return ListOfStaffForPanel(res);
};

export const postCreatePanel = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return CreatePanel(req.body.panel, res);
  };

export const getPanelDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return PanelDetails(req.params.id as string, res);
};

export const getAllPanels = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return AllPanels(res);
};

export const postClosePanel = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return ClosePanel(req.body.panel, res);
};
