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

export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.userId = decoded.userId;
        return next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(403).json({ message: "Unauthorized" });
    }
}

