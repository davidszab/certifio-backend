import { Router } from "express";
import { readOwnerInfo } from "../lib/files";

const router = Router();

router.get("/owner", async (req, res) => {
	const info = await readOwnerInfo();
	res.send(info);
});

export default router;