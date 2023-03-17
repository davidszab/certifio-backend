import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { AdminRequired, AuthRequired } from "../middlewares/auth";

const router = Router();
const prisma = new PrismaClient();

router.get("/", AuthRequired, AdminRequired, async (req, res) => {
	const data = await prisma.signature.findMany({include: {_count: true}});
	const resp = data.map((e) => {
		return {
			id: e.id,
			name: e.name,
			title: e.title,
			img: e.img,
			basesUsing: e._count.signers
		}
	})
	res.send(resp);
});

router.get("/:id", AuthRequired, AdminRequired, async (req, res) => {
	const id = parseInt(req.params.id);
	const signature = await prisma.signature.findFirst({where: {id}, include: {signers: {include: {certificateBase: {include: {_count: {select: {certificates: true}}}}}}}});
	if(!signature)
		return res.status(404).send({respCode: "SIGNATURE_NOT_FOUND"});
	res.send(signature);
});

export default router;