import { Request, Response, NextFunction } from 'express';  
import { Signin, Signup, AllAdvisors, AllStudents } from '../services/admin';

export const checkReachable = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "Student APIs reachabled"} )
}

export const postSignup = (req: Request, res: Response, next: NextFunction) => {
    return Signup(req.body.user, res)
}

export const postSignin = (req: Request, res: Response, next: NextFunction) => {
    return Signin(req.body.user, res)
}

export const getAdvisors = (req: Request, res: Response, next: NextFunction) => {
    return AllAdvisors(res);
}

export const getStudents = (req: Request, res: Response, next: NextFunction) => {
    return AllStudents(res);
}