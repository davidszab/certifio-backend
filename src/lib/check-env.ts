interface EnvDef {
	key: string
	values?: string[],
	required?: () => boolean
}

const variables: (string | EnvDef)[] = [
	"DATABASE_URL",
	"FRONTEND_URL",
	"SYSTEM_EMAIL",
	"JWT_SECRET",
	{
		key: "EMAIL_MODE",
		values: ["AWS", "SMTP"]
	},
	{
		key: "AWS_REGION",
		required: () => process.env["EMAIL_MODE"] == "AWS"
	},
	{
		key: "AWS_ACCESS_KEY_ID",
		required: () => process.env["EMAIL_MODE"] == "AWS"
	},
	{
		key: "AWS_SECRET_ACCESS_KEY",
		required: () => process.env["EMAIL_MODE"] == "AWS"
	},
	{
		key: "SMTP_CONNECTION_URL",
		required: () => process.env["EMAIL_MODE"] == "SMTP"
	}
]

export function checkEnv() {
	const env = process.env;
	for (const v of variables) {
		if(typeof v == "string"){
			if(!env[v]){
				console.log(`Error: Enviromental variable ${v} is undefined.`);
				process.exit(1);
			}
		}else{
			const envDef = v as EnvDef;
			const value = env[envDef.key];
			const required = envDef.required ? envDef.required() : true;
			if(!value && required){
				console.log(`Error: Enviromental variable ${v.key} is undefined.`);
				process.exit(1);
			}
			if(required && value && envDef.values && !envDef.values.includes(value)){
				console.log(`Error: Enviromental variable ${v.key} should be one of the following: ${envDef.values.toString()} and got: ${value}`);
				process.exit(1);
			}
		}
	}
}

export function getEmailMode(){
	return process.env["EMAIL_MODE"] == "AWS" ? "AWS" : "SMTP";
}