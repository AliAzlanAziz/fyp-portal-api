import { Request, Response, NextFunction } from 'express';  
import { Signin, Signup } from '../services/admin';

const checkReachable = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "Student APIs reachabled"} )
}

const postSignup = (req: Request, res: Response, next: NextFunction) => {
    return Signup(req.body.user, res)
}

const postSignin = (req: Request, res: Response, next: NextFunction) => {
    return Signin(req.body.user, res)
}


export {
    checkReachable,
    postSignup,
    postSignin
}