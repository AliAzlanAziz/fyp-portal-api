import { Request, Response, NextFunction } from 'express';  
import { Signin, Signup, AcceptRequest, RejectRequest, CloseAdvisorRequest, AllStudentRequests,
    StudentRequest, AdvisorForm } from '../services/advisor';

export const checkReachable = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "Student APIs reachabled"} )
}

export const postSignup = (req: Request, res: Response, next: NextFunction) => {
    return Signup(req.body.user, res)
}

export const postSignin = (req: Request, res: Response, next: NextFunction) => {
    return Signin(req.body.user, res)
}

export const postAcceptRequest = (req: Request, res: Response, next: NextFunction) => {
    return AcceptRequest(req.body.contract, res)
}

export const postRejectRequest = (req: Request, res: Response, next: NextFunction) => {
    return RejectRequest(req.body.contract, res)
}

export const postCloseAdvisorRequest = (req: Request, res: Response, next: NextFunction) => {
    return CloseAdvisorRequest(req.body.contract, res);
}

export const getAllStudentRequests = (req: Request, res: Response, next: NextFunction) => {
    return AllStudentRequests(req.query.acceptance_status as string, req.context, res);
}

export const getStudentRequest = (req: Request, res: Response, next: NextFunction) => {
    return StudentRequest(req.params.id as string, res);
}

export const getAdvisorForm = (req: Request, res: Response, next: NextFunction) => {
    return AdvisorForm(req.params.id as string, res);
}