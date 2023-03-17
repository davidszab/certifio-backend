import express from "express";
import cors from "cors";
import AuthRouter from "./routers/auth";
import CertificatesRouter from "./routers/certificates";
import InfoRouter from "./routers/info";
import SignaturesRouter from "./routers/signatures";
import PeopleRouter from "./routers/people";
import BasesRouter from "./routers/bases";
import { checkEnv } from "./lib/check-env";
import { createPath } from "./lib/files";

const isProduction = process.env["production"];
checkEnv();

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));
app.use("/auth", AuthRouter);
app.use("/certificates", CertificatesRouter);
app.use("/info", InfoRouter);
app.use("/signatures", SignaturesRouter);
app.use("/people", PeopleRouter);
app.use("/bases", BasesRouter);
app.use("/storage/images", express.static(createPath("images")));

app.get("/", (req, res) => {
	res.send("Hello world");
});

const port = isProduction ? 80 : 8080;
app.listen(port, () => {console.log(`Service running on PORT ${port}`)});