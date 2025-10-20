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
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chatbot", async (req, res) => {
  const question = req.body.question || "";
  if (!question) return res.json({ answer: "Je n'ai pas compris ta question 😅" });

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es l'assistant virtuel de STE Construction. Réponds comme un conseiller humain, avec précision et chaleur."
        },
        { role: "user", content: question }
      ],
      max_tokens: 250,
      temperature: 0.7
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.json({ answer: "Désolé, je n’ai pas pu répondre cette fois 😕" });
  }
});

app.listen(10000, () => console.log("Serveur IA en ligne sur Render 🧠"));
