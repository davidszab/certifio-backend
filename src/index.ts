import express from "express";
import cors from "cors";
import AuthRouter from "./routers/auth";
import CertificatesRouter from "./routers/certificates";
import { checkEnv } from "./lib/check-env";

const isProduction = process.env["production"];
checkEnv();

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));
app.use("/auth", AuthRouter);
app.use("/certificates", CertificatesRouter);
app.get("/", (req, res) => {
	res.send("Hello world");
});

const port = isProduction ? 80 : 8080;
app.listen(port, () => {console.log(`Service running on PORT ${port}`)});