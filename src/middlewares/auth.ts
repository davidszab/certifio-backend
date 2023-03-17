import type {Request, Response, NextFunction} from "express";
import {verify} from "jsonwebtoken";

declare module "express-serve-static-core" {
	interface Request {
	  user?: {firstName: string, lastName: string, email: string, id: number, createdAt: Date, updatedAt: Date, isAdmin: Boolean}
	}
  }

export function AuthRequired(req: Request, res: Response, next: NextFunction){
	const jwt = req.headers["x-auth-key"];
	if(!jwt)
		return res.status(403).send({respCode: "AUTH_REQUIRED"});
	try{
		//@ts-ignore
		const data = verify(jwt, process.env["JWT_SECRET"] as string);
		let user = data.person;
		user.createdAt = new Date(user.createdAt);
		user.updatedAt = new Date(user.updatedAt);
		req.user = user;
		next();
	}
	catch(err){
		return res.status(403).send({respCode: "AUTH_REQUIRED"});
	}
}

export function AdminRequired(req: Request, res: Response, next: NextFunction){
	if(!req.user)
		return res.status(403).send({respCode: "AUTH_REQUIRED"});
	if(!req.user.isAdmin)
		return res.status(403).send({respCode: "ADMIN_REQUIRED"});
	next();
}