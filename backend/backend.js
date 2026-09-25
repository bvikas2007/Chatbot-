import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";


dotenv.config();


const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());


// =====================================================
// GEMINI
// =====================================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// =====================================================
// CHAT API
// =====================================================

app.post("/api/chat", async (req, res) => {

    try {

        // Get message from frontend
        const userMessage = req.body.message;


        // Send message to Gemini
        const response = await ai.models.generateContent({

            model: "gemini-3.6-flash",

            contents: userMessage

        });


        // Send Gemini response back to frontend
        res.json({

            reply: response.text

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            error: "Something went wrong"

        });

    }

});


// =====================================================
// START SERVER
// =====================================================

app.listen(3000, () => {

    console.log(
        "Server running on http://localhost:3000"
    );

});