import nodemailer from "nodemailer";
import * as aws from "@aws-sdk/client-ses"
import { getEmailMode } from "./check-env";
import hbs from "nodemailer-express-handlebars";
import {create} from "express-handlebars";
import { readOwnerInfo } from "./files";

let transporter: nodemailer.Transporter;

if(getEmailMode() == "SMTP"){
	const systemEmail = process.env["SYSTEM_EMAIL"];
	const smtpURL = process.env["SMTP_CONNECTION_URL"];
	transporter = nodemailer.createTransport(smtpURL, {from: `"Certifio" <${systemEmail}>`});
}else{
	const systemEmail = process.env["SYSTEM_EMAIL"];
	const ses = new aws.SES({
		apiVersion: "2010-12-01",
		region: process.env["AWS_REGION"],
	});
	transporter = nodemailer.createTransport({
		//@ts-ignore
		SES: {aws, ses},
		sendingRate: 10
	}, {from: `"Certifio" <${systemEmail}>`});
}

const engine = create({defaultLayout: false});
transporter.use("compile", hbs({
	viewEngine: engine,
	viewPath: "dist/email-templates"
}))


async function sendAuthenticationEmail(email: string, name: string, code: string, token: string){
	const frontendURL = process.env["FRONTEND_URL"];
	const systemEmail = process.env["SYSTEM_EMAIL"];
	const owner = await readOwnerInfo();
	await transporter.sendMail({
		to: `${name} <${email}>`,
		from: `${owner.name} <${systemEmail}>`,
		subject: "Certifio - Azonosítás",
		//@ts-ignore
		template: "authentication",
		context: {
			name,
			owner: owner.name,
			code,
			magicLink: `${frontendURL}/authentication?email=${email}&token=${token}`,
			contactURL: `${frontendURL}/about?contact`
		}
	});
}

async function sendNewCertificateEmail(name: string, email: string, id: string, title: string, date: Date){
	const frontendURL = process.env["FRONTEND_URL"];
	const systemEmail = process.env["SYSTEM_EMAIL"];
	const owner = await readOwnerInfo();
	await transporter.sendMail({
		to: `${name} <${email}>`,
		from: `${owner.name} <${systemEmail}>`,
		subject: "Certifio - Azonosítás",
		//@ts-ignore
		template: "certificate",
		context: {
			name,
			owner: owner.name,
			certificateURL: `${frontendURL}/c/${id}`,
			title,
			id,
			date: date.toLocaleString("hu"),
			contactURL: `${frontendURL}/about?contact`
		}
	});
}

export {sendAuthenticationEmail, sendNewCertificateEmail};