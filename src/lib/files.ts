import { access as fsAccess, readFile as fsRead } from "fs/promises";
import { constants as fsConstants } from "fs";

interface OwnerInfo {
	name: string;
	address?: {
		country: string;
		postalCode: string;
		city: string;
		street: string;
	};
	website?: string;
	contact?: {
		name: string;
		email: string;
	};
}

export function createPath(path: string) {
	return `${process.cwd()}/storage/${path}`;
}

export async function fileExists(path: string): Promise<boolean> {
	try {
		await fsAccess(createPath(path), fsConstants.R_OK);
		return true;
	} catch (e) {
		return false;
	}
}

export async function readOwnerInfo(): Promise<OwnerInfo> {
	if (await fileExists("owner.json")) {
		const f = await fsRead(createPath("owner.json"));
		try {
			const obj = JSON.parse(f.toString());
			if (obj.name) {
				const v = obj as OwnerInfo;
				return v;
			}
		} catch (err) {}
	}
	return { name: "DEMO" };
}
