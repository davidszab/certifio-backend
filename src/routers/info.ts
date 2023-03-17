import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { readOwnerInfo } from "../lib/files";
import { AdminRequired, AuthRequired } from "../middlewares/auth";

const router = Router();
const prisma = new PrismaClient();

router.get("/owner", async (req, res) => {
	const info = await readOwnerInfo();
	res.send(info);
});

router.get("/statistics", AuthRequired, AdminRequired, async (req, res) => {
	const signatures = await prisma.signature.count();
	const bases = await prisma.certificateBase.count();
	const certificates = await prisma.certificateBase.count();
	const people = await prisma.person.count();
	res.send({signatures, bases, certificates, people});
});

export default router;