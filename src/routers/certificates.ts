import { Router } from "express";
import { PrismaClient } from '@prisma/client'
import {readFile} from "fs/promises";
import AuthRequired from "../middlewares/auth";

const router = Router();
const prisma = new PrismaClient();

router.get("/", AuthRequired, async (req, res) => {
	const certificates = await prisma.certificate.findMany({where: {personId: req.user?.id}, include: {base: true}})
	const results = certificates.map((e) => {
		return {
			id: e.id,
			title: e.base.title,
			date: e.date
		}
	})
	res.send(results);
});

router.get("/:id", async (req, res) => {
	const {id} = req.params;
	const certificate = await prisma.certificate.findFirst({where: {id}, include: {base: {include: {signers: {include: {signature: true}}}}, person: true}});
	if(!certificate)
		return res.status(404).send({respCode: "CERT_NOT_FOUND"});
	const context = {
		person: {
			firstName: certificate.person.firstName,
			lastName: certificate.person.lastName
		},
		certificate: {
			id: certificate.id,
			title: certificate.base.title,
			date: certificate.date.toLocaleDateString("hu")
		},
		signatures: certificate.base.signers.map((e) => {
			return {order: e.no, ...e.signature}
		})
	}
	const template = await readFile(`${process.cwd()}/storage/templates/${certificate.base.template}/template.json`);
	res.send({context, template: JSON.parse(template.toString())});
});

export default router;