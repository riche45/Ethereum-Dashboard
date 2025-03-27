import express  from "express";
import { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const port = 3333;

app.get("/:p1/:p2", (req: Request, res: Response) => {
    const { p1, p2 } = req.params;
    res.send(
        {p1, p2}
    );
});

app.post("/", (req: Request, res: Response) => {
    const body = req.body;
    res.send(
        body
    );
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});