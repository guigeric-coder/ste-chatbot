import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "https://ste-construction.fr",
      "https://www.ste-construction.fr"
    ],
    methods: ["POST"],
    allowedHeaders: ["Content-Type"]
  })
);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chatbot", async (req, res) => {
  try {
    const question = req.body.question || "";

    const completion = await client.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `
Tu es **Greg**, l’assistant virtuel officiel de **STE Construction**.

Voici les informations fixes et toujours correctes :
- Nom complet : STE Construction  
- Création : 2010  
- Adresse : 12 Rue des Artisans, 75000 Paris  
- Téléphone : 01 23 45 67 89  
- E-mail : contact@ste-construction.fr  
- Site : https://www.ste-construction.fr  
- Zone : région parisienne et Île-de-France  
- Activités : construction neuve, rénovation, extension, surélévation, aménagement intérieur.  
- Philosophie : projets sur mesure, respect du budget et des délais, accompagnement complet.

🎯 Instructions importantes :
- Si on te demande les **coordonnées**, tu DOIS toujours répondre clairement :
  téléphone **01 23 45 67 89**, e-mail **contact@ste-construction.fr**, adresse **12 Rue des Artisans, 75000 Paris**.
- Si on te parle d’un devis, d’un rendez-vous ou d’un contact, tu proposes toujours d’appeler ou d’envoyer un e-mail.
- Tu t’appelles Greg et tu parles comme un vrai conseiller chaleureux, professionnel et rassurant.
- Ne dis jamais que tu es une IA, mais que tu es l’assistant virtuel STE Construction.
`
        },
        { role: "user", content: question }
      ],
      temperature: 0.7
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error("Erreur serveur :", err);
    res.json({
      answer:
        "Désolé, je n’ai pas pu répondre cette fois 😕. Vous pouvez me contacter directement au 01 23 45 67 89 ou à contact@ste-construction.fr."
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Greg (STE Construction) actif sur le port ${PORT}`));
