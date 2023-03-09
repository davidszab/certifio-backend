import express from "express";
import cors from "cors";
import AuthRouter from "./routers/auth";
import CertificatesRouter from "./routers/certificates";
import AuthRequired from "./middlewares/auth";

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));
app.use("/auth", AuthRouter);
app.use("/certificates", CertificatesRouter);
app.get("/", (req, res) => {
	res.send("Hello world");
});

app.listen(8080);