import { Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from "mongoose";
import { UserSignupModel } from "../models/userSignup.model";
import { UserSigninModel } from "../models/userSignin.model";
import User from '../schema/user';
import { UserRoles, isAdmin } from "../enums/roles.enum";

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
            return res.status(401).json({
                success: false,
                message: "Password does not match with confirm password!"
            })
        }

        const hash = bcrypt.hashSync(user.password, saltRounds)

        const newUser = new User({
            _id: new Types.ObjectId(),
            name: user.name,
            email: user.email,
            password: hash,
            role: UserRoles.ADMIN
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

        if(!isAdmin(result.role)){
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
                    role: UserRoles.ADMIN 
                }, 
                process.env.SECRET_KEY as string, 
                { expiresIn: '15d' }
            )

            return res.status(200).json({
                success: true,
                message: "Successfully logged in",
                token: token
            })
        }else{
            return res.status(401).json({
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

export const AllStudents = async (res: Response) => {
    try{
       const students = await User.find({ role: UserRoles.STUDENT }).select('name ID')

        return res.status(200).json({
            message: students.length + ' rows retreived!',
            students: students
        })
    }catch(error){
        return res.status(500).json({
            message: "Internal server error!"
        })
    }
}