import { NextFunction, Request, Response } from "express";
import Contract from "../schema/contract";

export const isAdvisorsContract = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const contract = await Contract.findOne({ _id: req.body.contract?.id })
        if(!contract){
            return res.status(404).json({
                message: "Entity does not exist!"
            })
        }
        if((contract.advisor as string).toString() !== (req.context.user._id as string).toString()){
            return res.status(401).json({
                message: "Unauthorized Access!"
            })
        }
        
        return next();
    }catch(error){
        return res.status(500).json({
            message: "Internal Server Error!"
        })
    }
}