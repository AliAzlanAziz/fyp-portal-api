import { Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from "mongoose";
import { UserSignupModel } from "../models/userSignup.model";
import { UserSigninModel } from "../models/userSignin.model";
import User from '../schema/user';
import { UserRoles, isAdvisor } from "../enums/roles.enum";
import { ContractModel } from "../models/contract.model";
import Contract from "../schema/contract";
import { AcceptanceStatus, isValidStatus } from "../enums/contract.enum";
import { ContextModel } from "../models/context.model";

const saltRounds = 10;

export const Signup = async (user: UserSignupModel, res: Response) => {
    try{
        const userExist = await User.findOne({ email: user.email })
        if(userExist){
            return res.status(404).json({
                message: "Error signing up!"
            })
        }

        if(user.password !== user.confirmPassword){
            return res.status(401).json({
                message: "Password does not match with confirm password!"
            })
        }

        if(!user.department){
            return res.status(400).json({
                message: "Advisor must enter his/her department!"
            })
        }

        const hash = bcrypt.hashSync(user.password, saltRounds)

        const newUser = new User({
            _id: new Types.ObjectId(),
            name: user.name,
            email: user.email,
            password: hash,
            role: UserRoles.ADVISOR,
            department: user.department,
        }); 

        await newUser.save()

        return res.status(200).json({
            message: "Success"
        })
    }catch(error){
        return res.status(500).json({
            message: "Error signing up!"
        })
    }
}

export const Signin = async (user: UserSigninModel, res: Response) => {
    try{
        const result = await User.findOne({ email: user.email })
        if(!result){
            return res.status(404).json({
                message: "User does not exist!",
            })
        }

        if(!isAdvisor(result.role)){
            return res.status(401).json({
                message: "Unauthorized Access!"
            })
        }

        const hash = bcrypt.compareSync( user.password, result.password)
        
        if(hash){
            const token = jwt.sign(
                { 
                    id: result._id, 
                    role: UserRoles.ADVISOR 
                }, 
                process.env.SECRET_KEY as string, 
                { expiresIn: '15d' }
            )

            return res.status(200).json({
                message: "Success",
                token: token
            })
        }else{
            return res.status(401).json({
                message: "Incorrect Credentials!"
            })
        }
    }catch(error){
        return res.status(500).json({
            message: "Error signing in!"
        })
    }
}

export const AcceptRequest = async (contract: ContractModel, res: Response) => {
    try{
        const contractUpdated = await Contract.findOneAndUpdate(
            { _id: contract.id, acceptance: AcceptanceStatus.NOT_RESPONDED, isClosed: false }, 
            { acceptance: AcceptanceStatus.ACCEPTED }, 
            { new: true }
        )
        if(!contractUpdated){
            return res.status(400).json({
                message: 'Something wrong!'
            })
        }

        return res.status(200).json({
            message: 'Request accepted successfully!'
        })
    }catch(error){
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export const RejectRequest = async (contract: ContractModel, res: Response) => {
    try{
        const contractUpdated = await Contract.findOneAndUpdate(
            { _id: contract.id, acceptance: AcceptanceStatus.NOT_RESPONDED, isClosed: false }, 
            { acceptance: AcceptanceStatus.REJECTED }, 
            { new: true }
        )

        if(!contractUpdated){
            return res.status(400).json({
                message: 'Something wrong!'
            })
        }

        return res.status(200).json({
            message: 'Request rejected successfully!'
        })
    }catch(error){
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export const CloseAdvisorRequest = async (contract: ContractModel, res: Response) => {
    try{
        const contractUpdated = await Contract.findOneAndUpdate(
            { _id: contract.id, acceptance: AcceptanceStatus.ACCEPTED, isClosed: false }, 
            { isClosed: true }, 
            { new: true }
        )
        if(!contractUpdated){
            return res.status(400).json({
                message: 'Something wrong!'
            })
        }

        return res.status(200).json({
            message: 'Request closed successfully!'
        })
    }catch(error){
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export const AllStudentRequests = async (status: string, context: ContextModel, res: Response) => {
    try{
        if(!isValidStatus(status)){
            return res.status(400).json({
                message: 'Invalid request status!'
            })
        }

        const contracts = await Contract
                                .find({ advisor: context.user._id, acceptance: status })
                                .populate('student', '_id name ID').select({studentOne: 0, studentTwo: 0, advisor: 0})

        return res.status(200).json({
            success: true,
            message: contracts.length + ' rows retreived!',
            contracts: contracts
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
}

export const StudentRequest = async (id: string, res: Response) => {
    try{
        const contract = await Contract.findById(id).populate('student', '_id name ID').select({advisor: 0})

        return res.status(200).json({
            success: true,
            message: 'successful!',
            contract: contract
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
}