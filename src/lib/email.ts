import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'johnpaul71@ethereal.email',
        pass: 'S7DsgQ7qE3kvVWtv8m'
    }
});

async function sendAuthenticationEmail(email: string, name: string, code: string, token: string){
	let info = await transporter.sendMail({
		from: '"Certifio" <certifio@example.com>', // sender address
		to: `${name} <${email}>`, // list of receivers
		subject: "Certifio - Emailes azonosítás", // Subject line
		text: `A belépéshez szükséges kódja: ${code}`, // plain text body
		html: `<h1>A belépéshez szükséges kód: ${code}</h1><br><h1>A belépéshez <a href="http://localhost:5173/authentication?email=${email}&token=${token}" target="_window">kattintson ide!</a></h1>`, // html body
	});
}

export {sendAuthenticationEmail};