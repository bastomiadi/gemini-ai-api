import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { GoogleGenAI } from "@google/genai";

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// **Set your default Gemini model here:**
const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));


app.post('/generate-text', async (req, res) => {
    const { prompt } = req.body;
    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt, type: "text" },
            ],
            maxOutputTokens: 8192,
        });
        res.json({ output: response.text });
    } catch (error) {
        console.error("Error generating text:", error);
        res.status(500).json({ error: "Error to generate text" });
    }
}); 

app.post('/generate-from-image', upload.single('image'), async (req, res) => {
    const { prompt } = req.body;
    const imageBuffer = req.file.buffer.toString("base64");

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt, type: "text" },
                { inlineData: { data: imageBuffer, mimeType: req.file.mimetype } }
            ],
            //maxOutputTokens: 1024,
        });
        res.json({ output: response.text });
    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).json({ error: "Failed to generate image" });
    }
}); 

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
    const { prompt } = req.body;
    const audioBuffer = req.file.buffer.toString("base64");

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt, type: "text" },
                { inlineData: { data: audioBuffer, mimeType: req.file.mimetype } }
            ],
            //maxOutputTokens: 1024,
        });
        res.json({ output: response.text });
    } catch (error) {
        console.error("Error generating audio:", error);
        res.status(500).json({ error: "Failed to generate audio" });
    }
});

// app.post('/generate-from-video', upload.single('video'), async (req, res) => {
//     const { prompt } = req.body;
//     const videoBuffer = req.file.buffer.toString("base64");

//     try {
//         const response = await ai.models.generateContent({
//             model: GEMINI_MODEL,
//             contents: [
//                 { text: prompt, type: "text" },
//                 { inlineData: { data: videoBuffer, mimeType: req.file.mimetype } }
//             ],
//             //maxOutputTokens: 1024,
//         });
//         res.json({ output: response.text });
//     } catch (error) {
//         console.error("Error generating video:", error);
//         res.status(500).json({ error: "Failed to generate video" });
//     }
// });

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
    const { prompt } = req.body;
    const documentBuffer = req.file.buffer.toString("base64");

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                { text: prompt, type: "text" },
                { inlineData: { data: documentBuffer, mimeType: req.file.mimetype } }
            ],
            //maxOutputTokens: 1024,
        });
        res.json({ output: response.text });
    }   catch (error) {
        console.error("Error generating document:", error);
        res.status(500).json({ error: "Failed to generate document" });
    }
});