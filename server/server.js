import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
//************************************************/
const rateLimit = (function () {
    let inProgress = false;
    let queue = [];
    const processQueue = function () {
        if (queue.length > 0) {
            inProgress = true;
            const next = queue.shift();
            next().then(function () {
                inProgress = false;
                processQueue();
            });
        }
    }
    return function (fn) {
        return new Promise(function (resolve, reject) {
            queue.push(function () {
                return fn().then(resolve, reject);
            });
            if (!inProgress) {
                processQueue();
            }
        });
    };
})();
//************************************************/

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async function (req, res) {
    res.status(200).send({
        message: "Hello from Code-Ally"
    })
});

app.post("/", async function (req, res) {
    try {
        const prompt = req.body.prompt;

        await rateLimit(async function () {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `${prompt}`,
                temperature: 0,
                max_tokens: 3000,
                top_p: 1,
                frequency_penalty: 0.5,
                presence_penalty: 0,
            });
            res.status(200).send({
                bot: response.data.choices[0].text
            });
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
});

app.listen(5000, function () {
    console.log("Server is running on port: http://localhost:5000");
});

