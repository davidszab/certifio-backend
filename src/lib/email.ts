import nodemailer from "nodemailer";
import * as aws from "@aws-sdk/client-ses"
import { getEmailMode } from "./check-env";
import hbs from "nodemailer-express-handlebars";
import {create} from "express-handlebars";

const systemEmail = process.env["SYSTEM_EMAIL"];

let transporter: nodemailer.Transporter;

if(getEmailMode() == "SMTP"){
	const smtpURL = process.env["SMTP_CONNECTION_URL"];
	transporter = nodemailer.createTransport(smtpURL, {from: `"Certifio" <${systemEmail}>`});
}else{
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
	let info = await transporter.sendMail({
		to: `${name} <${email}>`, // list of receivers
		subject: "Certifio - Azonosítás", // Subject line
		//@ts-ignore
		template: "authentication",
		context: {
			name,
			code,
			magicLink: `${frontendURL}/authentication?email=${email}&token=${token}`,
			owner: "Tudod Nyelviskola",
			site: "certifio.davidszabo.hu"
		}
	});
}

export {sendAuthenticationEmail};