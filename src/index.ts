import express from "express";
import cors from "cors";
import AuthRouter from "./routers/auth";
import CertificatesRouter from "./routers/certificates";

const isProduction = process.env["production"];

if(!process.env["DATABASE_URL"]){
	console.error("DATABASE_URL env variable required.");
	process.exit(1);
}

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