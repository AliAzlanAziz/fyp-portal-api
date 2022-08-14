import { Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from "mongoose";
import { UserSignupModel } from "../models/userSignup.model";
import { UserSigninModel } from "../models/userSignin.model";
import User from '../schema/user';
import { UserRoles, isStudent } from "../enums/roles.enum";
import { ContractModel } from "../models/contract.model";
import Contract from "../schema/contract";
import { AcceptanceStatus, isValidStatus, isAccepted } from "../enums/contract.enum";
import { ContextModel } from "../models/context.model";
import { isLimitReached } from "../constants/contract";

const saltRounds = 10;

export const Signup = async (user: UserSignupModel, res: Response) => {
    try{
        const userExist = await User.findOne({ email: user.email })
        if(userExist){
            return res.status(404).json({
                success: false,
                message: "Error signing up!"
            })
        }

        if(user.password !== user.confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password does not match with confirm password!"
            })
        }

        if(!user.ID){
            return res.status(400).json({
                success: false,
                message: "Student must enter his/her registration ID provided by the university! Enter correct ID as it cannot be modified later"
            })
        }

        const hash = bcrypt.hashSync(user.password, saltRounds)

        const newUser = new User({
            _id: new Types.ObjectId(),
            name: user.name,
            email: user.email,
            password: hash,
            role: UserRoles.STUDENT,
            ID: user.ID
        }); 

        await newUser.save()

        return res.status(200).json({
            success: true,
            message: "Successfully signed up!"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error signing up!"
        })
    }
}

export const Signin = async (user: UserSigninModel, res: Response) => {
    try{
        const result = await User.findOne({ email: user.email })
        if(!result){
            return res.status(404).json({
                success: false,
                message: "User does not exist!",
            })
        }

        if(!isStudent(result.role)){
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access!"
            })
        }

        const hash = bcrypt.compareSync(user.password, result.password)

        if(hash){
            const token = jwt.sign(
                { 
                    id: result._id, 
                    role: UserRoles.STUDENT 
                }, 
                process.env.SECRET_KEY as string, 
                { expiresIn: '15d' }
            )

            return res.status(200).json({
                success: false,
                message: "Successfully signed in!",
                token: token
            })
        }else{
            return res.status(401).json({
                success: false,
                message: "Incorrect Credentials!"
            })
        }
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error signing in!"
        })
    }
}

export const AllAdvisors = async (res: Response) => {
    try{
       const advisors = await User.find({ role: UserRoles.ADVISOR }).select('name department')

        return res.status(200).json({
            message: advisors.length + ' rows retreived!',
            advisors: advisors
        })
    }catch(error){
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export const SelectAdvisor = async (contract: ContractModel, context: ContextModel, res: Response) => {
    try{
        const contractCount = await Contract
        .find({ advisor: contract.advisor, acceptance: AcceptanceStatus.ACCEPTED, isClosed: false }).count()
        if(isLimitReached(contractCount)){
            return res.status(400).json({
                message: "Advisor can no more accept any fyp group!"
            })
        }

        const contractExist = await Contract.findOne().or([
            { student: context.user._id, acceptance: AcceptanceStatus.ACCEPTED, isClosed: false },
            { student: context.user._id, acceptance: AcceptanceStatus.NOT_RESPONDED, isClosed: false },
            { studentOne: { ID: context.user.ID } , acceptance: AcceptanceStatus.ACCEPTED, isClosed: false },
            { studentOne: { ID: context.user.ID } , acceptance: AcceptanceStatus.NOT_RESPONDED, isClosed: false },
            { studentTwo: { ID: context.user.ID } , acceptance: AcceptanceStatus.ACCEPTED, isClosed: false },
            { studentTwo: { ID: context.user.ID } , acceptance: AcceptanceStatus.NOT_RESPONDED, isClosed: false }
        ])
        if(contractExist){
            if(isAccepted(contractExist.acceptance)){
                return res.status(400).json({
                    message: "You have already selected an advisor or may be your group mate! Ask your advisor to close the request if you want to request another advisor!"
                })
            }else{
                return res.status(400).json({
                    message: "You have already requested an advisor or may be your group mate! Close that request to request another advisor!"
                })
            }
        }

        if(contract.studentOne.ID !== context.user.ID){
            const otherStudentContractExist = await Contract.findOne().or([
                { studentOne: { ID: contract.studentOne.ID } , acceptance: AcceptanceStatus.ACCEPTED, isClosed: false },
                { studentOne: { ID: contract.studentOne.ID } , acceptance: AcceptanceStatus.NOT_RESPONDED, isClosed: false },
                { studentTwo: { ID: contract.studentOne.ID } , acceptance: AcceptanceStatus.ACCEPTED, isClosed: false },
                { studentTwo: { ID: contract.studentOne.ID } , acceptance: AcceptanceStatus.NOT_RESPONDED, isClosed: false }
            ])
            if(otherStudentContractExist){
                if(isAccepted(otherStudentContractExist.acceptance)){
                    return res.status(400).json({
                        message: "Your other member has already selected an advisor! Ask your advisor to close his/her request if you want to request advisor!"
                    })
                }else{
                    return res.status(400).json({
                        message: "Your other member has already requested an advisor! Ask him to close that request to request advisor!"
                    })
                }
            }
        }else{
            const otherStudentContractExist = await Contract.findOne().or([
                { studentOne: { ID: contract.studentTwo.ID } , acceptance: AcceptanceStatus.ACCEPTED, isClosed: false },
                { studentOne: { ID: contract.studentTwo.ID } , acceptance: AcceptanceStatus.NOT_RESPONDED, isClosed: false },
                { studentTwo: { ID: contract.studentTwo.ID } , acceptance: AcceptanceStatus.ACCEPTED, isClosed: false },
                { studentTwo: { ID: contract.studentTwo.ID } , acceptance: AcceptanceStatus.NOT_RESPONDED, isClosed: false }
            ])
            if(otherStudentContractExist){
                if(isAccepted(otherStudentContractExist.acceptance)){
                    return res.status(400).json({
                        message: "Your other member has already selected an advisor! Ask your advisor to close his/her request if you want to request advisor!"
                    })
                }else{
                    return res.status(400).json({
                        message: "Your other member has already requested an advisor! Ask him to close that request to request advisor!"
                    })
                }
            }
        }

        if(contract.studentOne.ID !== context.user.ID &&
            contract.studentTwo.ID !== context.user.ID){
            return res.status(400).json({
                message: "Student can only fill his/her request form! One of the student must be him/her. Enter exact ID as entered upon signing up."
            })
        }
        if(contract.studentOne.ID === context.user.ID &&
            contract.studentTwo.ID === context.user.ID){
            return res.status(400).json({
                message: "Error! Same ID found for both students"
            })
        }

        const newContract = new Contract({
            _id: new Types.ObjectId(),
            student: context.user._id,
            advisor: contract.advisor,
            project: contract.project,
            studentOne: contract.studentOne,
            studentTwo: contract.studentTwo,
        })
        await newContract.save();

        return res.status(200).json({
            message: 'Request successfully sent to the advisor'
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export const CloseAdvisorRequest = async (contract: ContractModel, res: Response) => {
    try{
        const contractUpdated = await Contract.findOneAndUpdate(
            { _id: contract.id, acceptance: AcceptanceStatus.NOT_RESPONDED, isClosed: false }, 
            { isClosed: true }, 
            { new: true }
        )
        if(!contractUpdated){
            return res.status(400).json({
                status: false,
                message: 'Something wrong!'
            })
        }

        return res.status(200).json({
            status: true,
            message: 'Request closed successfully!'
        })
    }catch(error){
        return res.status(500).json({
            status: false,
            message: "Internal server error!"
        })
    }
}

export const AllAdvisorsRequest = async (status: string, context: ContextModel, res: Response) => {
    try{
        if(!isValidStatus(status)){
            return res.status(400).json({
                success: false,
                message: 'Invalid request status!'
            })
        }

        const contracts = await Contract
                                .find({ student: context.user._id, acceptance: status })
                                .populate('advisor', '_id name department').select({studentOne: 0, studentTwo: 0, student: 0})

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

export const AdvisorRequest = async (id: string, res: Response) => {
    try{
        const contract = await Contract.findById(id).populate('advisor', '_id name department').select({student: 0})

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