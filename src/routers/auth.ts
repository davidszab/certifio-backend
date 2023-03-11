import { Router } from "express";
import { generateAuthKey, getJWT } from "../lib/auth-key";
import { PrismaClient } from '@prisma/client'
import { sendAuthenticationEmail } from "../lib/email";

const router = Router();

router.post("/start", async (req, res) => {
	const {email} = req.body;
	if(!email)
		return res.status(400).send({respCode: "EMAIL_REQUIRED"});
	const prisma = new PrismaClient();
	const person = await prisma.person.findFirst({where: {email}});
	if(!person)
		return res.status(404).send({respCode: "INVALID_EMAIL"});
	const authKey = await generateAuthKey();
	await prisma.authKey.create({
		data: {
			codeHash: authKey.codeHash,
			tokenHash: authKey.tokenHash,
			personId: person.id,
			createdAt: new Date()
		},
	});
	await prisma.$disconnect();
	try{
		await sendAuthenticationEmail(email, `${person.lastName} ${person.firstName}`, authKey.code, authKey.token);
	}catch(err){
		console.log(err);
		return res.status(500).send({respCode: "SENDING_FAILURE"})
	}
	return res.status(200).send({respCode: "EMAIL_SENT"});
});

router.post("/process", async (req, res) => {
	const {email, token, code} = req.body;
	if(!email)
		return res.status(400).send({respCode: "EMAIL_REQUIRED"});
	if(!token && !code)
		return res.status(400).send({respCode: "TOKEN_OR_CODE_REQUIRED"});
	const jwt = await getJWT({email, token, code});
	if(jwt){
		return res.send({respCode: "AUTH_OK", jwt});
	}
	res.status(403).send({respCode: "INVALID_CREDENTIALS"});
})

export default router;