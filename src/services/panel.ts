import { Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from "mongoose";
import { UserSignupModel } from "../models/userSignup.model";
import { UserSigninModel } from "../models/userSignin.model";
import User from '../schema/user';
import { UserRoles, isPanel } from "../enums/roles.enum";

const saltRounds = 10;

const Signup = async (user: UserSignupModel, res: Response) => {
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
            role: UserRoles.PANEL,
            department: user.department,
            inPanel: false
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

const Signin = async (user: UserSigninModel, res: Response) => {
    try{
        const result = await User.findOne({ email: user.email })
        if(!result){
            return res.status(404).json({
                message: "User does not exist!",
            })
        }

        if(!isPanel(result.role)){
            return res.status(401).json({
                message: "Unauthorized Access!"
            })
        }

        const hash = bcrypt.compareSync( user.password, result.password)
        
        if(hash){
            const token = jwt.sign(
                { 
                    id: result._id, 
                    role: UserRoles.PANEL 
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

export {
    Signin,
    Signup
}