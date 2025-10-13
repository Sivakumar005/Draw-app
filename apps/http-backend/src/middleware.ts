import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction,Request,Response } from "express";

declare global{
    namespace Express{
        interface Request{
            userId:String;
        }
    }
}

export function middleware(req:Request,res:Response,next:NextFunction){
    const token=req.headers['authorization']||"";
    const decoded = jwt.verify(token,JWT_SECRET);

    if(decoded){
        req.userId=(decoded as JwtPayload ).userId;
        next()
    }else{
        res.status(403).json({
            message:"unauthorized"
        })
    }
}