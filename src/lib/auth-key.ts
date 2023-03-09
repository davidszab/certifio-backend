import {hash, compare} from "bcrypt";
import {randomInt, randomUUID} from "crypto";
import { PrismaClient } from '@prisma/client'
import {sign} from "jsonwebtoken";

async function generateAuthKey(){
	const token = randomUUID();
	const code = randomInt(1000, 10000).toString();
	const tokenHash = await hash(token, 10);
	const codeHash = await hash(code, 10);
	return {token, tokenHash, code, codeHash};
}

interface validateAuthKeyParams {
	email: string,
	token?: string,
	code?: string
}

function notExpired(createdAt: Date){
	const expiration = new Date(createdAt);
	expiration.setMinutes(expiration.getMinutes() + 10);
	return new Date() <= expiration;
}

async function getJWT({email, token, code}: validateAuthKeyParams){
	const prisma = new PrismaClient();
	const last = await prisma.authKey.findFirst({include: {person: true}, where: {person: {email}}, orderBy: [{createdAt: "desc"}]});
	if(last){
		if(!last.hasBeenUsed && notExpired(last.createdAt)){
			if(token && await compare(token, last.tokenHash) || code && await compare(code, last.codeHash)){
				await prisma.authKey.update({where: {id: last.id}, data: {hasBeenUsed: true}});
				await prisma.$disconnect();
				const jwt = sign({person: last.person}, "secret");
				return jwt;
			}
		}
	}
	await prisma.$disconnect();
	return false;
}


export {generateAuthKey, getJWT}