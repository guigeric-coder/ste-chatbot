import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: [
    "https://ste-construction.fr",
    "https://www.ste-construction.fr"
  ],
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chatbot", async (req, res) => {
  try {
    const question = req.body.question || "";

    const completion = await client.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "Tu es l'assistant officiel de STE Construction. Réponds avec convivialité et professionnalisme à toutes les questions liées à la construction, rénovation et extension de maisons en région parisienne." },
        { role: "user", content: question }
      ],
      temperature: 0.8
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.json({ answer: "Désolé, je n’ai pas pu répondre cette fois 😕" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
