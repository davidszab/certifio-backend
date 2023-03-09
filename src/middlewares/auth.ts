import type {Request, Response, NextFunction} from "express";
import {verify} from "jsonwebtoken";

declare module "express-serve-static-core" {
	interface Request {
	  user?: {firstName: string, lastName: string, email: string, id: number, createdAt: Date, updatedAt: Date}
	}
  }

export default function AuthRequired(req: Request, res: Response, next: NextFunction){
	const jwt = req.headers["x-auth-key"];
	if(!jwt)
		return res.status(403).send({respCode: "AUTH_REQUIRED"});
	try{
		//@ts-ignore
		const data = verify(jwt, "secret");
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