import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { AdminRequired, AuthRequired } from "../middlewares/auth";

const router = Router();
const prisma = new PrismaClient();

router.get("/", AuthRequired, AdminRequired, async (req, res) => {
	const data = await prisma.person.findMany();
	res.send(data);
});

router.get("/:id", AuthRequired, AdminRequired, async (req, res) => {
	const id = parseInt(req.params.id);
	const signature = await prisma.signature.findFirst({where: {id}, include: {signers: {include: {certificateBase: {include: {_count: {select: {certificates: true}}}}}}}});
	if(!signature)
		return res.status(404).send({respCode: "SIGNATURE_NOT_FOUND"});
	res.send(signature);
});

export default router;